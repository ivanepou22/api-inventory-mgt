import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

const createTag = async (tag: Prisma.TagUncheckedCreateInput) => {
  const { name } = tag;
  const slug = await slugify(name);
  try {
    const tagExists = await db.tag.findUnique({
      where: {
        slug,
      },
    });
    if (tagExists) {
      throw new Error("Tag already exists");
    }
    const newTag = await db.tag.create({
      data: {
        name,
        slug,
      },
      include: {
        productTags: true,
      },
    });
    return {
      data: newTag,
      message: "Tag created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Tag:", error);
    throw new Error(error.message);
  }
};

const getTags = async () => {
  try {
    const tags = await db.tag.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        productTags: true,
      },
    });
    return {
      data: tags,
      message: "Tags fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Tags:", error);
    throw new Error(error.message);
  }
};

const getTag = async (id: string) => {
  try {
    const tag = await db.tag.findUnique({
      where: { id },
      include: {
        productTags: true,
      },
    });
    if (!tag) {
      throw new Error("Tag not found");
    }
    return {
      data: tag,
      message: "Tag fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Tag:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateTag = async (id: string, tag: Prisma.TagUncheckedCreateInput) => {
  const { name } = tag;
  try {
    const tagExists = await db.tag.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true },
    });
    if (!tagExists) {
      throw new Error("Tag not found");
    }
    const slug = name ? await slugify(name) : tagExists.slug;

    if (slug && slug !== tagExists.slug) {
      const tagBySlug = await db.tag.findUnique({
        where: {
          slug,
        },
      });
      if (tagBySlug) {
        throw new Error(`Tag with slug: ${slug} already exists`);
      }
    }

    // Perform the update
    const updatedTag = await db.tag.update({
      where: { id },
      data: {
        name,
        slug,
      },
      include: {
        productTags: true,
      },
    });
    return {
      data: updatedTag,
      message: "Tag updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Tag:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteTag = async (id: string) => {
  try {
    // Check if the tag exists
    const tag = await db.tag.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!tag) {
      throw new Error("Tag not found");
    }
    // Delete the tag
    const deletedTag = await db.tag.delete({
      where: { id },
    });
    return {
      data: deletedTag,
      message: "Tag deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting Tag:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const tagService = {
  createTag,
  getTags,
  getTag,
  updateTag,
  deleteTag,
};
