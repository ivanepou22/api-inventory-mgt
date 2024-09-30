import { db } from "@/db/db";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const createUser = async (user: Prisma.UserCreateInput) => {
  const {
    email,
    username,
    password,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    image,
    role,
  } = user;
  try {
    //check if the user exists by email, username and phone
    const userByEmail = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (userByEmail) {
      throw new Error(`Email: ${email} is Already taken`);
    }

    const userByUsername = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (userByUsername) {
      throw new Error(`Username: ${username} is Already taken`);
    }

    const userByPhone = await db.user.findUnique({
      where: {
        phone,
      },
    });
    if (userByPhone) {
      throw new Error(`Phone Number: ${phone} is Already taken`);
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create the user
    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        image: image
          ? image
          : "https://utfs.io/f/276c9ec4-bff3-40fc-8759-6b4c362c1e59-o0u7dg.png",
        role,
      },
    });
    //send verification code
    //modify the returned user
    const { password: string, ...modifiedUser } = newUser;
    return {
      data: modifiedUser,
      message: "User created successfully",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

const getUsers = async () => {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const modifiedUser = users?.map((user) => {
      const { password, ...otherViews } = user;
      return otherViews;
    });
    return {
      data: modifiedUser,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error getting users.");
  }
};

const getUser = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const { password, ...modifiedUser } = user;
    return {
      data: modifiedUser,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateUser = async (id: string, user: Prisma.UserCreateInput) => {
  const { email, username, firstName, lastName, phone, dob, gender, image } =
    user;
  try {
    // Find the user first
    const userExists = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        dob: true,
        gender: true,
        image: true,
      },
    });

    if (!userExists) {
      throw new Error("User not found.");
    }

    //check if the user exists by email, username and phone
    if (email && email !== userExists.email) {
      const userByEmail = await db.user.findUnique({
        where: {
          email,
        },
      });
      if (userByEmail) {
        throw new Error(`Email: ${email} is Already taken`);
      }
    }
    if (username && username !== userExists.username) {
      const userByUsername = await db.user.findUnique({
        where: {
          username,
        },
      });
      if (userByUsername) {
        throw new Error(`Username: ${username} is Already taken`);
      }
    }

    if (phone && phone !== userExists.phone) {
      const userByPhone = await db.user.findUnique({
        where: {
          phone,
        },
      });
      if (userByPhone) {
        throw new Error(`Phone Number: ${phone} is Already taken`);
      }
    }

    // Perform the update
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        email,
        username,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        image,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        dob: true,
        gender: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      data: updatedUser,
      message: "User updated successfully",
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateUserPassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
    // Fetch the user's current password
    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Old password is incorrect.");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const updatedUser = await db.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        dob: true,
        gender: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      data: updatedUser,
      message: "Password updated successfully",
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteUser = async (id: string) => {
  try {
    // Check if the user exists
    const user = await db.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!user) {
      throw new Error("User not found.");
    }
    // Delete the user
    const deletedUser = await db.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        dob: true,
        gender: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      data: deletedUser,
      message: `User deleted successfully`,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const getAttendants = async () => {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "ATTENDANT",
      },
    });
    const modifiedUser = users?.map((user) => {
      const { password, ...otherViews } = user;
      return otherViews;
    });
    return {
      data: modifiedUser,
      message: "Attendants fetched successfully",
    };
  } catch (err: any) {
    console.log(err);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

const getAdmins = async () => {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "ADMIN",
      },
    });
    const modifiedUser = users?.map((user) => {
      const { password, ...otherViews } = user;
      return otherViews;
    });
    return {
      data: modifiedUser,
    };
  } catch (err: any) {
    console.log(err);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

export const userService = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  getAttendants,
  getAdmins,
};
