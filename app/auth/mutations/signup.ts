import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"

export default resolver.pipe(resolver.zod(Signup), async ({ username, password }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: { username: username.toLowerCase().trim(), hashedPassword },
    select: { id: true, name: true, username: true },
  })

  await ctx.session.$create({ userId: user.id, role: "USER" })
  return user
})
