export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const token = process.env.PAGBANK_TOKEN
  const baseUrl = process.env.PAGBANK_BASE_URL

  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Token PagBank não configurado',
    })
  }

  const payload = {
    reference_id: `pedido_${Date.now()}`,
    customer: {
      name: body.name,
      email: body.email,
      tax_id: body.cpf,
    },
    items: [
      {
        name: body.productName,
        quantity: 1,
        unit_amount: body.amount, // em centavos
      },
    ],
    qr_codes: [
      {
        amount: {
          value: body.amount,
        },
        expiration_date: new Date(
          Date.now() + 30 * 60 * 1000
        ).toISOString(), // 30 min
      },
    ],
    notification_urls: [
      'https://seusite.com/webhook/pagbank',
    ],
  }

  const response = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error(data)
    throw createError({
      statusCode: 400,
      statusMessage: 'Erro ao criar pedido PIX',
    })
  }

  return data
})