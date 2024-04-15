"use server";
import { nameGeneratorOptions } from "@/helpers/name-generator-options";
import { prisma } from "@/helpers/prisma";
import { SKSUser } from "@prisma/client";
import { uniqueNamesGenerator } from "unique-names-generator";

export async function createUser({ name: definedName }: Omit<SKSUser, "id">) {
  try {
    const name = definedName || uniqueNamesGenerator(nameGeneratorOptions());
    const createUser = await prisma.sKSUser.create({
      data: {
        name,
      },
    });
    return {
      status: 200,
      body: {
        message: "User created",
        data: createUser,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        message: "Error creating user",
        error: JSON.stringify(error),
      },
    };
  }
}
