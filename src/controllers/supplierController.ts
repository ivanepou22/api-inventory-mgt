import { db } from "@/db/db";
import { Request, Response } from "express";

// Create a new supplier
export const createSupplier = async (req: Request, res: Response) => {
  const {
    supplierType,
    name,
    contactPerson,
    phone,
    email,
    country,
    location,
    website,
    taxPin,
    regNumber,
    bankAccountNumber,
    bankName,
    paymentTerms,
    logo,
    rating,
    note,
  } = req.body;

  const supplierByPhone = await db.supplier.findUnique({
    where: {
      phone,
    },
  });
  if (supplierByPhone) {
    return res.status(409).json({
      error: `Phone Number: ${phone} is Already in use by another Supplier`,
      data: null,
    });
  }

  if (email) {
    const supplierByEmail = await db.supplier.findUnique({
      where: {
        email,
      },
    });
    if (supplierByEmail) {
      return res.status(409).json({
        error: `Email: ${email} is Already in use by another Supplier`,
        data: null,
      });
    }
  }

  if (regNumber) {
    const supplierByRegNumber = await db.supplier.findUnique({
      where: {
        regNumber,
      },
    });
    if (supplierByRegNumber) {
      return res.status(409).json({
        error: `Registration Number: ${regNumber} is Already in use by another Supplier`,
        data: null,
      });
    }
  }

  try {
    const newSupplier = await db.supplier.create({
      data: {
        supplierType,
        name,
        contactPerson,
        phone,
        email,
        country,
        location,
        website,
        taxPin,
        regNumber,
        bankAccountNumber,
        bankName,
        paymentTerms,
        logo,
        rating,
        note,
      },
    });

    return res.status(201).json({
      data: newSupplier,
      message: "Supplier created Successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create supplier" });
  }
};

// Get all suppliers
export const getSuppliers = async (_req: Request, res: Response) => {
  try {
    const suppliers = await db.supplier.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: suppliers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve suppliers" });
  }
};

// Get a single supplier by ID
export const getSupplier = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const supplier = await db.supplier.findUnique({
      where: {
        id,
      },
    });

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    return res.status(200).json({
      data: supplier,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve supplier" });
  }
};

// Update a supplier by ID
export const updateSupplier = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    supplierType,
    name,
    contactPerson,
    phone,
    email,
    country,
    location,
    website,
    taxPin,
    regNumber,
    bankAccountNumber,
    bankName,
    paymentTerms,
    logo,
    rating,
    note,
  } = req.body;

  try {
    const existingSupplier = await db.supplier.findUnique({
      where: { id },
    });

    if (!existingSupplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    if (phone && phone !== existingSupplier.phone) {
      const supplierByPhone = await db.supplier.findUnique({
        where: {
          phone,
        },
      });
      if (supplierByPhone) {
        return res.status(409).json({
          error: `Phone Number: ${phone} is Already in use by another Supplier`,
          data: null,
        });
      }
    }

    if (email && email !== existingSupplier.email) {
      const supplierByEmail = await db.supplier.findUnique({
        where: {
          email,
        },
      });
      if (supplierByEmail) {
        return res.status(409).json({
          error: `Email: ${email} is Already in use by another Supplier`,
          data: null,
        });
      }
    }

    if (regNumber && regNumber !== existingSupplier.regNumber) {
      const supplierByRegNumber = await db.supplier.findUnique({
        where: {
          regNumber,
        },
      });
      if (supplierByRegNumber) {
        return res.status(409).json({
          error: `Registration Number: ${regNumber} is Already in use by another Supplier`,
          data: null,
        });
      }
    }

    const updatedSupplier = await db.supplier.update({
      where: { id },
      data: {
        supplierType: supplierType || existingSupplier.supplierType,
        name: name || existingSupplier.name,
        contactPerson: contactPerson || existingSupplier.contactPerson,
        phone: phone || existingSupplier.phone,
        email: email || existingSupplier.email,
        country: country || existingSupplier.country,
        location: location || existingSupplier.location,
        website: website || existingSupplier.website,
        taxPin: taxPin || existingSupplier.taxPin,
        regNumber: regNumber || existingSupplier.regNumber,
        bankAccountNumber:
          bankAccountNumber || existingSupplier.bankAccountNumber,
        bankName: bankName || existingSupplier.bankName,
        paymentTerms: paymentTerms || existingSupplier.paymentTerms,
        logo: logo || existingSupplier.logo,
        rating: rating || existingSupplier.rating,
        note: note || existingSupplier.note,
      },
    });

    return res.status(200).json({
      data: updatedSupplier,
      message: `Supplier updated successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update supplier" });
  }
};

// Delete a supplier by ID
export const deleteSupplier = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const existingSupplier = await db.supplier.findUnique({
      where: { id },
    });

    if (!existingSupplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    await db.supplier.delete({
      where: { id },
    });

    return res.status(200).json({
      message: `Supplier deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete supplier" });
  }
};
