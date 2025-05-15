"use client"

import type React from "react"

import { useState } from "react"
import { uploadPdf } from "../actions/upload-pdf"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileIcon, UploadIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)

      const formData = new FormData()
      formData.append("pdf", file)

      const result = await uploadPdf(formData)

      if (result.success) {
        toast({
          title: "Upload successful",
          description: "Your PDF has been uploaded",
        })
        setFile(null)
        // Reset the file input
        const fileInput = document.getElementById("pdf-upload") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        toast({
          title: "Upload failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Upload error",
        description: "An error occurred during upload",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload PDF</CardTitle>
        <CardDescription>Upload a PDF file to store in Cloudinary and MongoDB</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                  {file ? (
                    <>
                      <FileIcon className="h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <UploadIcon className="h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm font-medium">Click to select a PDF</p>
                      <p className="text-xs text-gray-500">or drag and drop a file here</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload PDF"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
