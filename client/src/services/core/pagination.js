export function parseNextPage(headers) {
  const linkHeader = headers.get('Link')

  if (!linkHeader) {
    return null
  }

  const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/) // find the URL of the next page in the Link header

  if (!nextMatch) { // if there is no next page URL in the Link header, return null
    return null
  }

  const nextUrl = new URL(nextMatch[1]) // parse the next page URL
  const nextPage = Number(nextUrl.searchParams.get('_page')) 

  return Number.isNaN(nextPage) ? null : nextPage 
}
