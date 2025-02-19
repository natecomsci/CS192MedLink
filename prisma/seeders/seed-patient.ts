import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  // Seed 10 random patients with only patientID and securityQuestion
  for (let i = 0; i < 10; i++) {
    // Choose a random security question
    const securityQuestion = getRandomSecurityQuestion()

    const patient = await prisma.patient.create({
      data: {
        patientID: faker.string.uuid(),
        securityQuestion: securityQuestion
      },
    })

    console.log(`Created patient: ${patient.patientID}`)
  }

  console.log('10 random patients have been seeded successfully!')
}

// Helper function to pick a random security question
function getRandomSecurityQuestion() {
  const questions = [
    'STREETNAME',
    'FIRSTFRIENDNICKNAME',
    'FAVORITEOUTDOORGAME',
    'FIRSTPETNAME',
    'INFLUENTIALTEACHER',
    'FAVORITETVSHOW',
    'FAVORITEULAM',
    'UNUSUALSTREETFOOD',
    'FIRSTJOB',
    'MEMORABLEBIRTHDAYGIFT',
  ]
  const randomIndex = Math.floor(Math.random() * questions.length)
  return questions[randomIndex]
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
