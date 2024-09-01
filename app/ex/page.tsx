'use client'
import { useState } from 'react'

function page() {
    const [imageFile, setImageFile] = useState<string | null>(null)

    function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            setImageFile(URL.createObjectURL(event.target.files[0]))
        }
    }

    return (
        <div>
            <input type="file" onChange={handleFileUpload} />
            {imageFile && <img src={imageFile} alt="Uploaded" />}
        </div>
    )
}

export default page