import { resolver, generateToken, hash256 } from "blitz"
import db from "db"
import { forgotPasswordMailer } from "mailers/forgotPasswordMailer"
import { ForgotPassword } from "../validations"

const RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 4

export default resolver.pipe(resolver.zod(ForgotPassword), async ({ username }) => {
  // 1. Get the user
  const user = await db.user.findFirst({ where: { username: username.toLowerCase() } })

  // 2. Generate the token and expiration date.
  const token = generateToken()
  const hashedToken = hash256(token)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS)

  // 3. If user with this username was found
  // if (user) {
  //   // 4. Delete any existing password reset tokens
  //   await db.token.deleteMany({ where: { type: "RESET_PASSWORD", userId: user.id } })
  //   // 5. Save this new token in the database.
  //   await db.token.create({
  //     data: {
  //       user: { connect: { id: user.id } },
  //       type: "RESET_PASSWORD",
  //       expiresAt,
  //       hashedToken,
  //       sentTo: user.username,
  //     },
  //   })
  //   // 6. Send the username
  //   await forgotPasswordMailer({ to: user.username, token }).send()
  // } else {
  //   // 7. If no user found wait the same time so attackers can't tell the difference
  //   await new Promise((resolve) => setTimeout(resolve, 750))
  // }

  // 8. Return the same result whether a password reset username was sent or not
  return
})
