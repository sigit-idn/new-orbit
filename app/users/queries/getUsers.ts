import db from "db"

export default async function getUsers() {
  const user = await db.user.findMany({ select: { id: true, name: true, username: true } })

  return user
}
