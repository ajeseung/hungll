import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { useRuntimeConfig } from 'nuxt/app'

let s3Client: S3Client | null = null

export function getS3Client() {
  if (!s3Client) {
    const config = useRuntimeConfig()
    const region = config.public.AWS_REGION
    const accessKeyId = config.public.AWS_ACCESS_KEY_ID
    const secretAccessKey = config.public.AWS_SECRET_ACCESS_KEY

    if (!region || !accessKeyId || !secretAccessKey) {
      console.error('❌ AWS 설정 누락:', { region, accessKeyId, secretAccessKey })
      throw new Error('AWS 설정이 누락되었습니다.')
    }

    s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }
  return s3Client
}

export async function uploadImageToS3(file: File): Promise<string> {
  const config = useRuntimeConfig()
  const s3 = getS3Client()

  const fileExtension = file.name.split('.').pop()
  const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`
  const key = `boards/${uniqueFileName}`

  console.log('📤 S3 업로드 준비:', {
    fileName: file.name,
    type: file.type,
    key,
    bucket: config.public.AWS_BUCKET_NAME,
  })

  const arrayBuffer = await file.arrayBuffer()
  const body = new Uint8Array(arrayBuffer)

  const params = {
    Bucket: config.public.AWS_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: file.type || 'application/octet-stream', 
  }

  try {
    const result = await s3.send(new PutObjectCommand(params))
    const url = `https://${config.public.AWS_BUCKET_NAME}.s3.${config.public.AWS_REGION}.amazonaws.com/${key}`
    console.log('✅ S3 업로드 성공:', { url, result })
    return url
  } catch (error) {
    console.error('❌ S3 업로드 실패:', error)
    throw error
  }
}

export async function deleteImageFromS3(imageUrl: string): Promise<void> {
  const config = useRuntimeConfig()
  const s3 = getS3Client()

  const urlParts = imageUrl.split('/')
  const key = urlParts.slice(3).join('/')

  console.log('🗑️ S3 이미지 삭제 준비:', { key })

  const params = {
    Bucket: config.public.AWS_BUCKET_NAME,
    Key: key,
  }

  try {
    await s3.send(new DeleteObjectCommand(params))
    console.log(`🗑️ S3 이미지 삭제 완료: ${key}`)
  } catch (error) {
    console.error('❌ S3 이미지 삭제 실패:', error)
    throw error
  }
}
