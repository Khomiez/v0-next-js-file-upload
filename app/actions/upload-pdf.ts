"use server"

import { revalidatePath } from "next/cache"
import cloudinary from "@/lib/cloudinary"
import clientPromise from "@/lib/mongodb"

export async function uploadPdf(formData: FormData) {
  try {
    // Get the file from the form data
    const file = formData.get("pdf") as File

    if (!file) {
      return { success: false, message: "No file provided" }
    }

    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      return { success: false, message: "Only PDF files are allowed" }
    }

    // Convert the file to a buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Convert buffer to base64
    const base64String = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64String}`

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          resource_type: "auto",
          folder: "pdf-uploads",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
    })

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("pdf-uploads")

    // Save file info to MongoDB
    const fileInfo = {
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      url: (uploadResponse as any).secure_url,
      publicId: (uploadResponse as any).public_id,
    }

    await db.collection("files").insertOne(fileInfo)

    // Revalidate the path to update the UI
    revalidatePath("/")

    return {
      success: true,
      message: "File uploaded successfully",
      fileInfo,
    }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
