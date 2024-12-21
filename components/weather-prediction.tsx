import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CloudSun, Upload, Loader2 } from 'lucide-react'

export default function WeatherPrediction() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    setImageUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []} })

  const handleSubmit = async () => {
    if (!file) return

    setIsLoading(true)
    setPrediction(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('https://weatherimageprediction.azurewebsites.net/predict', {
        method: 'POST',
        body: formData,
      })

      console.log('response')

      if (!response.ok) {
        throw new Error("'Error en la predicción'")
      }

      const data = await response.json()
      setPrediction(data.result)
    } catch (error) {
      console.error("'Error:'", error)
      setPrediction("'Error al procesar la imagen'")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-center text-2xl font-bold">
            <CloudSun className="mr-2" />
            Predicción de Clima por Imagen
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${
              isDragActive ? "'border-blue-500 bg-blue-50'" : "'border-gray-300 hover:border-blue-400 hover:bg-blue-50'"
            }`}
          >
            <input {...getInputProps()} />
            {
              file
                ? (
                  <div className="text-gray-700">
                    <p>Archivo seleccionado: <span className="font-semibold">{file.name}</span></p>
                    {/* Mostrar la imagen seleccionada */}
                    <img src={imageUrl!} alt="Imagen seleccionada" className="mt-4 w-full h-auto rounded-md" />
                  </div>
                )
                : (
                  <div className="text-gray-500">
                    <Upload className="mx-auto mb-2" size={32} />
                    <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar un archivo</p>
                  </div>
                )
            }
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={!file || isLoading} 
            className="w-full mt-6 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : "'Predecir Clima'"}
          </Button>
          {prediction && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-200 via-pink-200 to-red-200 rounded-lg shadow-inner">
              <h3 className="font-semibold text-gray-800 mb-2">Predicción:</h3>
              <p className="text-gray-700">{prediction}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

