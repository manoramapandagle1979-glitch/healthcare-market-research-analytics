import { getReportFull } from '@/lib/wp-data/server'
import MarketOutlookClient from './MarketOutlookClient'

export default async function Page({ params }: { params: { slug: string; region: string } }) {
  const wpFull = await getReportFull(params.slug)
  return <MarketOutlookClient params={params} wpFull={wpFull} />
}
