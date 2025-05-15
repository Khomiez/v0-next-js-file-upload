"use server"

import clientPromise from "@/lib/mongodb"

export type FileDocument = {
  _id: string
  filename: string
  size: number
  type: string
  uploadedAt: Date
  url: string
  publicId: string
}

export async function getFiles() {
  try {
    const client = await clientPromise
    const db = client.db("pdf-uploads")

    const files = await db.collection("files").find({}).sort({ uploadedAt: -1 }).toArray()

    return {
      success: true,
      files: JSON.parse(JSON.stringify(files)) as FileDocument[],
    }
  } catch (error) {
    console.error("Error fetching files:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      files: [],
    }
  }
}
