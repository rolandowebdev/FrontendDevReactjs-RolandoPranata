import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  ImageContainer,
  Input,
  PageContainer,
  RatingStar,
  Separator,
  Textarea,
  queryClient
} from '@/components'
import { RestaurantsApiUrl } from '@/constants'
import { useDetailRestaurant, useLoadMore, useToast } from '@/hooks'
import { axiosInstance } from '@/lib'
import { Review } from '@/types'
import { reviewSchema } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useMutation } from '@tanstack/react-query'
import { GlassWater, Pizza } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as z from 'zod'

export const Detail = () => {
  const { toast } = useToast()
  const { restaurantId } = useParams()
  const { data } = useDetailRestaurant({
    id: restaurantId
  })

  const detailRestaurant = data?.restaurant

  const { indexItem, isCompleted, loadMore } = useLoadMore({
    items: detailRestaurant?.customerReviews
  })

  const initialListReviews = detailRestaurant?.customerReviews?.slice(
    0,
    indexItem
  )

  const reviewForm = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      id: restaurantId,
      name: '',
      review: ''
    }
  })

  const addReview = useMutation({
    mutationFn: (newReview: Review) => {
      return axiosInstance.post('/review', newReview, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['detail-restaurant', restaurantId]
      })
    }
  })

  const onSubmitReview = (values: z.infer<typeof reviewSchema>) => {
    addReview.mutate(values)
    toast({
      variant: 'success',
      title: 'Success',
      description: 'Your review has been added 🎉️.'
    })
    reviewForm.reset()
  }

  return (
    <PageContainer>
      <div className='text-center'>
        <h1 className='mb-3 text-4xl font-extrabold tracking-tight lg:text-5xl'>
          {detailRestaurant?.name}
        </h1>
        <span className='leading-7 [&:not(:first-child)]:mt-6'>
          {detailRestaurant?.address}
        </span>
      </div>

      <article className='my-10 sm:my-12 lg:my-14'>
        <div className='grid grid-cols-1 gap-10 xl:grid-cols-2'>
          <ImageContainer>
            <img
              className='h-full w-full rounded-lg object-cover'
              src={`${RestaurantsApiUrl.imageUrl}/${detailRestaurant?.pictureId}`}
              alt=''
            />
          </ImageContainer>
          <div>
            <div className='flex flex-wrap items-center gap-3'>
              <h2 className='text-3xl font-semibold tracking-tight first:mt-0'>
                {detailRestaurant?.name}
              </h2>
              <RatingStar rating={detailRestaurant?.rating as number} />
            </div>
            <p className='mb-2 leading-7 text-zinc-500 [&:not(:first-child)]:mt-6'>
              {detailRestaurant?.description}
            </p>
            <div className='mt-4 flex items-center gap-1'>
              {detailRestaurant?.categories.map((category, id) => (
                <Badge key={id} className='px-3'>
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </article>

      <article className='my-10 grid grid-cols-1 gap-6 sm:my-12 lg:my-14 lg:grid-cols-2'>
        <div className='flex w-full flex-col items-center gap-4'>
          <div className='w-full'>
            <h3 className='text-2xl font-semibold tracking-tight'>Drinks</h3>
            <Separator className='my-3' />
            <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
              {detailRestaurant?.menus.drinks.map((drink, id) => (
                <Card
                  key={id}
                  className='cursor-default transition-all hover:bg-secondary'>
                  <CardContent className='flex items-center gap-2'>
                    <GlassWater size={16} />
                    <span className='text-xs font-medium leading-none'>
                      {drink.name}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className='w-full'>
            <h3 className='text-2xl font-semibold tracking-tight'>Foods</h3>
            <Separator className='my-3' />
            <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
              {detailRestaurant?.menus.foods.map((food, id) => (
                <Card
                  key={id}
                  className='cursor-default transition-all hover:bg-secondary'>
                  <CardContent className='flex items-center gap-2'>
                    <Pizza size={16} />
                    <span className='text-xs font-medium leading-none'>
                      {food.name}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className='w-full'>
          <h3 className='text-2xl font-semibold tracking-tight'>Reviews</h3>
          <Separator className='my-3' />
          <div className='w-full'>
            <FormProvider {...reviewForm}>
              <form
                onSubmit={reviewForm.handleSubmit(onSubmitReview)}
                className='space-y-3'>
                <FormField
                  control={reviewForm.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Your name.' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={reviewForm.control}
                  name='review'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Type your review here.'
                          className='resize-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' className='w-full'>
                  Submit
                </Button>
              </form>
            </FormProvider>

            <div className='mt-4 flex flex-col gap-2'>
              {initialListReviews?.map((review, id) => (
                <Card key={id} className='border-none shadow-none'>
                  <CardContent className='flex gap-4'>
                    <Avatar>
                      <AvatarImage
                        src='https://github.com/shadcn.png'
                        alt='@shadcn'
                      />
                      <AvatarFallback>shadcn</AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col gap-2'>
                      <h4 className='text-base text-muted-foreground'>
                        {review.name}
                        <span className='ml-2 text-xs text-zinc-400'>
                          {review.date}
                        </span>
                      </h4>
                      <p>{review.review}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!isCompleted &&
              initialListReviews &&
              detailRestaurant?.customerReviews &&
              initialListReviews?.length <
                detailRestaurant?.customerReviews?.length ? (
                <Button
                  onClick={loadMore}
                  className='mt-3 block w-full'
                  variant='outline'>
                  Load More
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    </PageContainer>
  )
}
