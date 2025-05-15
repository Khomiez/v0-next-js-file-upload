import UploadForm from "./components/upload-form"
import FileList from "./components/file-list"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">PDF Upload Application</h1>

        <div className="grid gap-8 md:grid-cols-1">
          <UploadForm />
          <FileList />
        </div>
      </div>
    </main>
  )
}
