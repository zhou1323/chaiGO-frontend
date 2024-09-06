import useInfiniteScroll from '@/hooks/use-infinite-scroll';
import {
  GetOffersListParams,
  getOffersList,
} from '@/lib/dashboard/offerClient';
import { getOfferInfo } from '@/lib/utils';
import { paths } from '@/paths';
import useCustomizationStore from '@/store/customization';
import { Offer } from '@/types/offer';
import { AddShoppingCart, ArrowRight } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface OperationProps {
  offers: {
    [key: string]: { open: boolean; items: (Offer & { checked: boolean })[] };
  };
  setOffers: React.Dispatch<
    React.SetStateAction<{
      [key: string]: { open: boolean; items: (Offer & { checked: boolean })[] };
    }>
  >;
}

export default function OffersList({
  operationProps,
  isMinimal = false,
}: {
  operationProps?: OperationProps;
  isMinimal?: boolean;
}): React.ReactNode {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreOffers = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const params: GetOffersListParams = {
        page,
        size: 20, // Adjust the size as needed
      };
      const response = await getOffersList(params);
      const newOffers = response.items;

      if (newOffers.length === 0) {
        setHasMore(false);
      } else {
        setOffers((prevOffers) => [...prevOffers, ...newOffers]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const { loaderRef } = useInfiniteScroll({
    hasMore,
    loading: isLoading,
    onLoadMore: loadMoreOffers,
  });

  useEffect(() => {
    loadMoreOffers();
  });

  const addToCart = (item: Offer) => {
    if (!operationProps) return;
    operationProps.setOffers((prevOffers) => {
      if (prevOffers[item.storeName]) {
        const sameItem = prevOffers[item.storeName].items?.find(
          (i) => i.item === item.item
        );
        return {
          ...prevOffers,
          [item.storeName]: {
            ...prevOffers[item.storeName],
            items: [
              ...prevOffers[item.storeName].items,
              {
                ...item,
                id: sameItem ? `${item.id}-${Date.now()}` : item.id,
                checked: false,
              },
            ],
          },
        };
      }
      return {
        ...prevOffers,
        [item.storeName]: {
          open: true,
          items: [{ ...item, checked: false }],
        },
      };
    });
  };

  return (
    <>
      {isMinimal ? (
        <MinimalList
          offers={offers}
          isLoading={isLoading}
          loaderRef={loaderRef}
        />
      ) : (
        <OrdinaryList
          offers={offers}
          addToCart={addToCart}
          isLoading={isLoading}
          loaderRef={loaderRef}
        />
      )}
    </>
  );
}

function MinimalList({
  offers,
  isLoading,
  loaderRef,
}: {
  offers: Offer[];
  isLoading: boolean;
  loaderRef: React.RefObject<HTMLDivElement>;
}) {
  const router = useRouter();
  return (
    <Card className="flex w-1/3 flex-col">
      <CardHeader title="Offers" />
      <Divider />
      <CardContent className="flex-1 overflow-y-auto">
        <Stack spacing={2}>
          {offers.map((offer, index) => (
            <OfferContent
              key={index}
              offer={offer}
              isMinimal={true}
              addToCart={() => {}}
            />
          ))}
        </Stack>
        {isLoading && (
          <Box className="mt-4 flex items-center justify-center">
            <CircularProgress size={20} color="info" />
          </Box>
        )}
        <Box ref={loaderRef} />
      </CardContent>
      <Divider />
      <CardActions className="justify-end px-4 py-2">
        <Button
          size="small"
          endIcon={<ArrowRight></ArrowRight>}
          onClick={() => router.push(paths.dashboard.offers)}
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}

function OrdinaryList({
  offers,
  addToCart,
  isLoading,
  loaderRef,
}: {
  offers: Offer[];
  addToCart: (item: Offer) => void;
  isLoading: boolean;
  loaderRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <>
      <Grid container spacing={2}>
        {offers.map((offer, index) => (
          <Grid item xs={12} sm={12} md={6} lg={6} key={index}>
            <Card>
              <CardContent className="w-auto p-4">
                <OfferContent
                  offer={offer}
                  isMinimal={false}
                  addToCart={addToCart}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {isLoading && (
        <Box className="mt-4 flex items-center justify-center">
          <CircularProgress size={20} color="info" />
        </Box>
      )}
      <Box ref={loaderRef} />
    </>
  );
}

function OfferContent({
  offer,
  isMinimal,
  addToCart,
}: {
  offer: Offer;
  isMinimal: boolean;
  addToCart: (item: Offer) => void;
}) {
  const getCurrencyString = useCustomizationStore(
    (state) => state.getCurrencyString
  );

  return (
    <Stack direction="row" spacing={2} className="items-center">
      <Box className="relative flex justify-center">
        <Box component="img" src={offer.imgUrl} className="h-20 w-20"></Box>
        {/* TODO: add valid period */}
        {/* <Box className="absolute bottom-0 flex items-center gap-1 bg-white">
          <KeyboardTab className="text-xs" fontSize="small" color="primary" />
          <Typography variant="caption" color="primary">{`Sunday`}</Typography>
        </Box> */}
      </Box>

      <Box overflow="hidden" textOverflow="ellipsis" className="flex-1">
        <Tooltip title={`${offer.itemEn}`} placement="top" arrow>
          <Typography
            variant="subtitle1"
            noWrap
            className="font-bold"
          >{`${offer.itemEn}`}</Typography>
        </Tooltip>
        <Tooltip
          title={getOfferInfo(
            offer.quantity,
            offer.unit,
            offer.unitRangeFrom,
            offer.unitRangeTo,
            offer.price,
            getCurrencyString
          )}
          placement="top"
          arrow
        >
          <Typography variant="body2" className="mb-2 text-gray-500">
            {getOfferInfo(
              offer.quantity,
              offer.unit,
              offer.unitRangeFrom,
              offer.unitRangeTo,
              offer.price,
              getCurrencyString
            )}
          </Typography>
        </Tooltip>
        <Chip
          label={`${offer.storeName}`}
          size="small"
          color="primary"
          className="p-0"
        />
      </Box>

      <Box className="flex flex-col items-center">
        <Typography
          variant="h6"
          color="error"
          className="font-bold"
        >{`${getCurrencyString(offer.price)}`}</Typography>
        {/* <Typography variant="subtitle2" className="text-gray-500 underline">
          {`Discount: ${offer.price}`}
        </Typography> */}
        {!isMinimal && offer.ordinaryPrice != 0 && (
          <Typography
            variant="subtitle2"
            className="text-gray-500 line-through"
          >
            {getCurrencyString(offer.ordinaryPrice)}
          </Typography>
        )}
      </Box>

      {!isMinimal && (
        <IconButton className="h-min" onClick={() => addToCart(offer)}>
          <AddShoppingCart />
        </IconButton>
      )}
    </Stack>
  );
}
