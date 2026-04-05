import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })


const adapter = new PrismaPg(pool)


const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding started...")
  const stations = [
    // CENTRAL
    "CSMT", "Masjid", "Sandhurst Road", "Byculla", "Chinchpokli",
    "Currey Road", "Parel", "Dadar", "Matunga", "Sion",
    "Kurla", "Vidyavihar", "Ghatkopar", "Vikhroli", "Kanjurmarg",
    "Bhandup", "Nahur", "Mulund", "Thane", "Kalwa",
    "Mumbra", "Diva", "Dombivli", "Kalyan",

    // WESTERN
    "Churchgate", "Marine Lines", "Charni Road", "Grant Road",
    "Mumbai Central", "Mahalaxmi", "Lower Parel",
    "Dadar", "Matunga Road", "Mahim", "Bandra",
    "Khar Road", "Santacruz", "Vile Parle", "Andheri",
    "Jogeshwari", "Goregaon", "Malad", "Kandivali",
    "Borivali", "Dahisar", "Mira Road", "Bhayandar",
    "Naigaon", "Vasai Road", "Nalasopara", "Virar",

    // HARBOUR
    "Panvel", "Khandeshwar", "Mansarovar", "Kharghar",
    "Belapur CBD", "Seawoods", "Nerul", "Juinagar",
    "Sanpada", "Vashi", "Mankhurd", "Govandi",
    "Chembur", "Tilak Nagar", "Chunabhatti",
    "Kurla", "Andheri"
  ]
  const stationMap: Record<string, string> = {}

  for (const name of stations) {
    const station = await prisma.station.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    stationMap[name] = station.id
  }

  const connections: { from: string; to: string; distance: number }[] = []

  function connect(a: string, b: string, distance: number) {
    connections.push({ from: a, to: b, distance })
    connections.push({ from: b, to: a, distance })
  }


  // CENTRAL LINE

  connect("CSMT", "Masjid", 2)
  connect("Masjid", "Sandhurst Road", 2)
  connect("Sandhurst Road", "Byculla", 2)
  connect("Byculla", "Chinchpokli", 2)
  connect("Chinchpokli", "Currey Road", 2)
  connect("Currey Road", "Parel", 2)
  connect("Parel", "Dadar", 2)
  connect("Dadar", "Matunga", 2)
  connect("Matunga", "Sion", 2)
  connect("Sion", "Kurla", 3)
  connect("Kurla", "Vidyavihar", 2)
  connect("Vidyavihar", "Ghatkopar", 2)
  connect("Ghatkopar", "Vikhroli", 3)
  connect("Vikhroli", "Kanjurmarg", 2)
  connect("Kanjurmarg", "Bhandup", 2)
  connect("Bhandup", "Nahur", 2)
  connect("Nahur", "Mulund", 2)
  connect("Mulund", "Thane", 4)
  connect("Thane", "Kalwa", 3)
  connect("Kalwa", "Mumbra", 3)
  connect("Mumbra", "Diva", 3)
  connect("Diva", "Dombivli", 3)
  connect("Dombivli", "Kalyan", 5)


  // WESTERN LINE

  connect("Churchgate", "Marine Lines", 2)
  connect("Marine Lines", "Charni Road", 2)
  connect("Charni Road", "Grant Road", 2)
  connect("Grant Road", "Mumbai Central", 2)
  connect("Mumbai Central", "Mahalaxmi", 2)
  connect("Mahalaxmi", "Lower Parel", 2)
  connect("Lower Parel", "Dadar", 2)
  connect("Dadar", "Matunga Road", 2)
  connect("Matunga Road", "Mahim", 2)
  connect("Mahim", "Bandra", 3)
  connect("Bandra", "Khar Road", 2)
  connect("Khar Road", "Santacruz", 2)
  connect("Santacruz", "Vile Parle", 2)
  connect("Vile Parle", "Andheri", 3)
  connect("Andheri", "Jogeshwari", 2)
  connect("Jogeshwari", "Goregaon", 2)
  connect("Goregaon", "Malad", 3)
  connect("Malad", "Kandivali", 2)
  connect("Kandivali", "Borivali", 3)
  connect("Borivali", "Dahisar", 2)
  connect("Dahisar", "Mira Road", 4)
  connect("Mira Road", "Bhayandar", 3)
  connect("Bhayandar", "Naigaon", 4)
  connect("Naigaon", "Vasai Road", 3)
  connect("Vasai Road", "Nalasopara", 3)
  connect("Nalasopara", "Virar", 4)


  // HARBOUR LINE

  connect("Panvel", "Khandeshwar", 3)
  connect("Khandeshwar", "Mansarovar", 3)
  connect("Mansarovar", "Kharghar", 3)
  connect("Kharghar", "Belapur CBD", 3)
  connect("Belapur CBD", "Seawoods", 2)
  connect("Seawoods", "Nerul", 2)
  connect("Nerul", "Juinagar", 2)
  connect("Juinagar", "Sanpada", 2)
  connect("Sanpada", "Vashi", 2)
  connect("Vashi", "Mankhurd", 4)
  connect("Mankhurd", "Govandi", 2)
  connect("Govandi", "Chembur", 2)
  connect("Chembur", "Tilak Nagar", 2)
  connect("Tilak Nagar", "Chunabhatti", 2)
  connect("Chunabhatti", "Kurla", 2)

  for (const c of connections) {
    await prisma.connection.create({
      data: {
        fromId: stationMap[c.from],
        toId: stationMap[c.to],
        distance: c.distance
      }
    })
  }

  console.log("Seeding completed ")
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })