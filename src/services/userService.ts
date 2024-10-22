import { db } from "@/db/db";
import { TenantManagementService } from "./tenantManagementService";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export class UserService extends TenantManagementService {
  constructor(db: PrismaClient) {
    super(db);
  }
  createUser = async (user: Prisma.UserCreateInput) => {
    const { fullName, email, username, password, phone, gender, image, role } =
      user;
    try {
      const userByEmail = await this.findUnique(
        (args) => this.db.user.findUnique(args),
        {
          where: {
            tenantId_email: {
              tenantId: this.getTenantId(),
              email,
            },
          },
        }
      );

      if (userByEmail) {
        throw new Error(`Email: ${email} is Already taken`);
      }
      const userByUsername = await this.findUnique(
        (args) => this.db.user.findUnique(args),
        {
          where: {
            tenantId_username: {
              tenantId: this.getTenantId(),
              username,
            },
          },
        }
      );

      if (userByUsername) {
        throw new Error(`Username: ${username} is Already taken`);
      }

      const userByPhone = await this.findUnique(
        (args) => this.db.user.findUnique(args),
        {
          where: {
            tenantId_phone: {
              tenantId: this.getTenantId(),
              phone,
            },
          },
        }
      );
      if (userByPhone) {
        throw new Error(`Phone Number: ${phone} is Already taken`);
      }
      //hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      //create the user
      const newUser = await this.create((args) => this.db.user.create(args), {
        data: {
          fullName,
          email,
          username,
          password: hashedPassword,
          phone,
          gender,
          image: image
            ? image
            : "https://utfs.io/f/276c9ec4-bff3-40fc-8759-6b4c362c1e59-o0u7dg.png",
          role,
          tenantId: this.getTenantId(),
        },
        include: {
          tenant: true,
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
      if (error instanceof Error) {
        const errorMessage = error.message;

        // Check if the error message contains the word "Argument"
        const argumentIndex = errorMessage.toLowerCase().indexOf("argument");
        if (argumentIndex !== -1) {
          // Extract the message after "Argument"
          const relevantError = errorMessage.slice(argumentIndex);
          throw new Error(relevantError);
        } else {
          // For other types of errors, you might want to log the full error
          // and throw a generic message to the user
          console.error("Full error:", error);
          throw new Error(error.message);
        }
      } else {
        // Handle case where error is not an Error object
        throw new Error("An unexpected error occurred.");
      }
    }
  };

  getUsers = async () => {
    try {
      const users = await this.findMany((args) => this.db.user.findMany(args), {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          tenant: true,
        },
      });

      const modifiedUser = users?.map((user) => {
        const { password, ...otherViews } = user;
        return otherViews;
      });
      return {
        data: modifiedUser,
        message: "Users fetched successfully",
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error getting users.");
    }
  };

  getUser = async (id: string) => {
    try {
      const user = await this.findUnique(
        (args) => this.db.user.findUnique(args),
        {
          where: { id },
          include: {
            tenant: true,
          },
        }
      );
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

  updateUser = async (id: string, user: Prisma.UserCreateInput) => {
    const { fullName, email, username, phone, gender, image } = user;
    try {
      // Find the user first
      const userExists = await this.findUnique(
        (args) => this.db.user.findUnique(args),
        {
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
          include: {
            tenant: true,
          },
        }
      );

      if (!userExists) {
        throw new Error("User not found.");
      }

      //check if the user exists by email, username and phone
      if (email && email !== userExists.email) {
        const userByEmail = await this.findUnique(
          (args) => this.db.user.findUnique(args),
          { where: { email } }
        );
        if (userByEmail) {
          throw new Error(`Email: ${email} is Already taken`);
        }
      }
      if (username && username !== userExists.username) {
        const userByUsername = await this.findUnique(
          (args) => this.db.user.findUnique(args),
          { where: { username } }
        );
        if (userByUsername) {
          throw new Error(`Username: ${username} is Already taken`);
        }
      }

      if (phone && phone !== userExists.phone) {
        const userByPhone = await this.findUnique(
          (args) => this.db.user.findUnique(args),
          { where: { phone } }
        );
        if (userByPhone) {
          throw new Error(`Phone Number: ${phone} is Already taken`);
        }
      }
      // Perform the update
      const updatedUser = await this.update(
        (args) => this.db.user.update(args),
        {
          where: { id },
          data: {
            fullName,
            email,
            username,
            phone,
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
        }
      );

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

  updateUserPassword = async (
    id: string,
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      const user = await this.findUnique(
        (args) => this.db.user.findUnique(args),
        {
          where: { id },
          select: { id: true, password: true },
        }
      );
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
      const updatedUser = await this.update(
        (args) => this.db.user.update(args),
        {
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
        }
      );

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

  deleteUser = async (id: string) => {
    try {
      const user = await this.findUnique(
        (args) => this.db.user.findUnique(args),
        {
          where: { id },
          select: { id: true },
        }
      );
      if (!user) {
        throw new Error("User not found.");
      }
      // Delete the user
      const deletedUser = await this.delete(
        (args) => this.db.user.delete(args),
        {
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
        }
      );
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

  getAttendants = async () => {
    try {
      const users = await this.findMany((args) => this.db.user.findMany(args), {
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

  getAdmins = async () => {
    try {
      const users = await this.findMany((args) => this.db.user.findMany(args), {
        orderBy: {
          createdAt: "desc",
        },
        where: { role: "ADMIN" },
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
}

export const userService = (): UserService => {
  return new UserService(db);
};
