import { SecurePassword } from "blitz"
import db from "./index"
import Chance from "chance"
import { DealStatus, TaskStatus } from "@prisma/client"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https: //chancejs.com
 * or https                                     : //github.com/Marak/faker.js to easily generate
 * realistic data.
 */

const seed = async () => {
  const chance = new Chance()
  const dealStatus = Object.keys(DealStatus).map((key) => DealStatus[key])
  const taskStatus = Object.keys(TaskStatus).map((key) => TaskStatus[key])

  try {
    // await db.comment.deleteMany({})
    // await db.attachement.deleteMany({})
    // await db.product.deleteMany({})
    // await db.task.deleteMany({})
    // await db.deal.deleteMany({})
    // await db.venture.deleteMany({})
    // await db.user.deleteMany({})

    const password = await SecurePassword.hash("password")

    await db.user.createMany({
      data: Array.from(
        { length: 5 },
        (_, i) =>
          new (function () {
            this.name = !i ? "admin" : chance.name({ prefix: false })
            this.username = this.name
              .match(/\w{4,}/g)
              .join("_")
              .toLowerCase()
            this.hashedPassword = password
          })()
      ),
    })

    await db.venture.createMany({
      data: Array.from({ length: 50 }, () => ({
        title: chance.sentence({ words: 3 }),
        description: chance.sentence(),
      })),
    })

    await db.deal.createMany({
      data: Array.from({ length: 50 }, () => ({
        title: chance.sentence({ words: 3 }),
        description: chance.sentence(),
        status: dealStatus[Math.floor(Math.random() * dealStatus.length)],
        dealOwnerId: Math.ceil(Math.random() * 5),
        userId: Math.ceil(Math.random() * 5),
        dueDate: new Date(new Date().getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000),
        dealChampionId: Math.ceil(Math.random() * 5),
        ventureId: Math.ceil(Math.random() * 5),
      })),
    })

    await db.task.createMany({
      data: Array.from({ length: 50 }, () => ({
        title: chance.sentence({ words: 3 }),
        description: chance.sentence(),
        userId: Math.ceil(Math.random() * 5),
        status: taskStatus[Math.floor(Math.random() * dealStatus.length)],
        dueDate: new Date(new Date().getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000),
        dealId: Math.ceil(Math.random() * 50),
      })),
    })

    await db.product.createMany({
      data: Array.from({ length: 50 }, () => ({
        title: chance.sentence({ words: 3 }),
        description: chance.sentence(),
        ventureId: Math.ceil(Math.random() * 50),
      })),
    })

    await db.attachement.createMany({
      data: Array.from({ length: 50 }, () => ({
        title: chance.sentence({ words: 3 }),
        url: chance.url(),
        dealId: Math.ceil(Math.random() * 50),
      })),
    })

    await db.comment.createMany({
      data: Array.from({ length: 50 }, () => ({
        content: chance.sentence({ words: 3 }),
        dealId: Math.ceil(Math.random() * 50),
        userId: Math.ceil(Math.random() * 5),
      })),
    })
  } catch (err) {
    console.error(err)
  }
}

export default seed
