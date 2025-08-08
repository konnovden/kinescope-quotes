import { redirect } from 'next/navigation'

export default function QuotesPage(){
  // Redirect admin root of quotes to the new quote creation page
  redirect('/admin/quotes/new')
}