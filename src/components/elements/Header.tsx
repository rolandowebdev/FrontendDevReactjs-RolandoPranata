import { Restaurant } from '@/types'
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Separator
} from '..'

type HeaderProps = {
  filterCity: string
  filterAlphabetically: string
  initialListRestaurant: Restaurant[]
  setFilterByCity: React.Dispatch<React.SetStateAction<string>>
  setFilterAlphabetically: React.Dispatch<React.SetStateAction<string>>
}

export const Header = ({
  filterCity,
  filterAlphabetically,
  initialListRestaurant,
  setFilterByCity,
  setFilterAlphabetically
}: HeaderProps) => {
  const listCity = [
    'Gorontalo',
    'Aceh',
    'Medan',
    'Bali',
    'Bandung',
    'Balikpapan',
    'Malang',
    'Ternate',
    'Surabaya'
  ]

  const clearFilters = () => {
    setFilterByCity('')
    setFilterAlphabetically('')
  }

  const checkIfUserHasFilter = () => {
    return filterCity === '' && filterAlphabetically === ''
  }

  return (
    <header className='mx-auto max-w-6xl px-4 pt-4 lg:px-0'>
      <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl'>
        Restaurants
      </h1>
      <p className='w-10/12 leading-7 [&:not(:first-child)]:mt-6'>
        Explore restaurants, find the perfect spot, stay updated on food trends,
        and connect with fellow foodies. Join us on a flavorful journey
        celebrating the art of dining!
      </p>
      <Separator className='my-4' />
      <nav className='flex items-center justify-between'>
        <div className='flex flex-wrap items-center gap-3'>
          <small className='text-sm font-medium leading-none'>
            Filter by :
          </small>
          <Select
            onValueChange={(value) => setFilterByCity(value)}
            disabled={initialListRestaurant.length < 1}>
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='City' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>City</SelectLabel>
                {listCity.map((city) => (
                  <SelectItem key={city} value={city.toLowerCase()}>
                    {city}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setFilterAlphabetically(value)}
            disabled={initialListRestaurant.length < 1}>
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Alphabetical' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='a-z'>A-Z</SelectItem>
              <SelectItem value='z-a'>Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={clearFilters}
          className='disabled:cursor-not-allowed'
          variant={checkIfUserHasFilter() ? 'outline' : 'destructive'}
          disabled={checkIfUserHasFilter()}>
          Clear All
        </Button>
      </nav>
    </header>
  )
}
