import { User } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany();
  return new Response(
    JSON.stringify({ users, Message: users.length > 0 ? "Users" : "No users" }),
    {
      status: 200,
    },
  );
}

export async function POST(req: Request) {
  const user = (await req.json()) as User;

  try {
    const userRegistered = await prisma.user.create({
      data: user,
    });
    return new Response(
      JSON.stringify({ userRegistered, Message: "Se ha registrado con exito" }),
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  const user = (await req.json()) as User;

  try {
    const userUpdated = await prisma.user.update({
      where: { id: user.id },
      data: user,
    });
    return new Response(
      JSON.stringify({ userUpdated, Message: "Se ha actualizado con exito" }),
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  try {
    const userDeleted = await prisma.user.delete({
      where: { id: id },
    });
    return new Response(
      JSON.stringify({ userDeleted, Message: "Se ha eliminado con exito" }),
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
}
