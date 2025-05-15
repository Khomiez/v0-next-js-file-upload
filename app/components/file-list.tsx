"use client"

import { useEffect, useState } from "react"
import { getFiles, type FileDocument } from "../actions/get-files"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileIcon, ExternalLinkIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function FileList() {
  const [files, setFiles] = useState<FileDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFiles() {
      try {
        setLoading(true)
        const result = await getFiles()

        if (result.success) {
          setFiles(result.files)
        } else {
          setError(result.message || "Failed to load files")
        }
      } catch (err) {
        setError("An error occurred while fetching files")
      } finally {
        setLoading(false)
      }
    }

    loadFiles()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>Loading your uploaded PDF files...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>There was an error loading your files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Files</CardTitle>
        <CardDescription>
          {files.length > 0
            ? `You have ${files.length} uploaded PDF file${files.length !== 1 ? "s" : ""}`
            : "No files uploaded yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {files.length > 0 ? (
          <div className="grid gap-4">
            {files.map((file) => (
              <div
                key={file._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="font-medium">{file.filename}</h3>
                    <div className="text-sm text-gray-500 flex space-x-3">
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-gray-500 hover:text-gray-900"
                >
                  <span className="mr-1">View</span>
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">Upload your first PDF file to see it here</div>
        )}
      </CardContent>
    </Card>
  )
}
