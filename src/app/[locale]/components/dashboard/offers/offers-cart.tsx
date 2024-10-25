import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import {
  recommendShoppingList,
  sendShoppingListEmail,
} from '@/lib/dashboard/offerClient';
import { getOfferInfo } from '@/lib/utils';
import useCustomizationStore from '@/store/customization';
import { Offer } from '@/types/offer';
import {
  Close,
  ExpandLess,
  ExpandMore,
  RemoveShoppingCart,
  ShoppingCart,
  Star,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import * as React from 'react';

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

export default function OffersCart({
  operationProps,
  weeklyBudget,
  locale,
}: {
  operationProps: OperationProps;
  weeklyBudget: number;
  locale: string;
}): React.ReactNode {
  const { t } = useTranslation(locale, Namespaces.dashboard);
  const handleCheckboxChange = (
    store: string,
    id: string,
    checked: boolean
  ) => {
    operationProps.setOffers((prevOffers) => ({
      ...prevOffers,
      [store]: {
        ...prevOffers[store],
        items: prevOffers[store].items.map((item) =>
          item.id === id ? { ...item, checked } : item
        ),
      },
    }));
  };

  const handleDeleteItem = (store: string, id: string) => {
    operationProps.setOffers((prevOffers) => ({
      ...prevOffers,
      [store]: {
        ...prevOffers[store],
        items: prevOffers[store].items.filter((item) => item.id !== id),
      },
    }));
  };

  const toggleDetails = (store: string) => {
    if (operationProps.offers[store]) {
      operationProps.setOffers((prevOffers) => ({
        ...prevOffers,
        [store]: {
          ...prevOffers[store],
          open: !prevOffers[store].open,
        },
      }));
    }
  };

  const calculateTotal = React.useCallback(
    (store: string) => {
      return (
        operationProps.offers[store]?.items.reduce(
          (total, item) => total + (!item.checked ? item.price : 0),
          0
        ) || 0
      );
    },
    [operationProps.offers]
  );

  const storesChosen = React.useMemo(() => {
    return Object.keys(operationProps.offers)
      .filter((store) => operationProps.offers[store].items.length > 0)
      .map((store) => store);
  }, [operationProps.offers]);

  const total = React.useMemo(() => {
    let total = 0;
    if (storesChosen.length === 0) return total;

    storesChosen.forEach((store) => {
      total += calculateTotal(store);
    });

    return total;
  }, [calculateTotal, storesChosen]);

  const getCurrencyString = useCustomizationStore(
    (state) => state.getCurrencyString
  );

  const sendShoppingList = async () => {
    try {
      const { message } = await sendShoppingListEmail({
        shoppingList: storesChosen.map((store) => ({
          storeName: store,
          offers: operationProps.offers[store].items.map((item) => ({
            ...item,
            priceString: getCurrencyString(item.price),
            offerInfo: getOfferInfo(
              item.quantity,
              item.unit,
              item.unitRangeFrom,
              item.unitRangeTo,
              item.price,
              getCurrencyString
            ),
          })),
          total: getCurrencyString(calculateTotal(store)),
        })),
        total: getCurrencyString(total),
        weeklyBudget: getCurrencyString(weeklyBudget),
      });
      if (message) {
        throw new Error(message);
      }
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  const [isGeneratingList, setIsGeneratingList] = React.useState(false);
  const generateShoppingList = async () => {
    setIsGeneratingList(true);
    try {
      const { message, data } = await recommendShoppingList({
        weeklyBudget: getCurrencyString(weeklyBudget),
      });
      if (message) {
        throw new Error(message);
      }

      let shoppingListContent: {
        [key: string]: {
          open: boolean;
          items: (Offer & { checked: boolean })[];
        };
      } = {};
      if (data && data.items) {
        data.items.forEach((item) => {
          shoppingListContent[item.storeName] = {
            items: [
              ...(shoppingListContent[item.storeName]?.items || []),
              { ...item, checked: false },
            ],
            open: true,
          };
        });
        operationProps.setOffers(shoppingListContent);
      }
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    } finally {
      setIsGeneratingList(false);
    }
  };
  return (
    <Box className="sticky top-20 h-min w-1/4">
      <Card
        className="rounded-lg bg-white shadow"
        sx={{
          '& .MuiCardHeader-action': {
            margin: 0,
          },
        }}
      >
        <CardHeader
          className="items-center justify-between"
          avatar={<ShoppingCart />}
          titleTypographyProps={{ variant: 'h6', className: 'font-bold' }}
          title={t('offers.cart')}
          action={
            <Tooltip title={t('offers.generateTips')}>
              <Button
                size="small"
                variant="contained"
                endIcon={<Star />}
                className="m-0 ml-4"
                onClick={generateShoppingList}
              >
                {t('offers.generate')}
              </Button>
            </Tooltip>
          }
        />
        <Divider />
        <CardContent>
          {storesChosen.length > 0 ? (
            <Stack spacing={1}>
              {storesChosen.map((store, index) => (
                <Stack key={store} spacing={1}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6" className="font-semibold">
                      {store}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        {t('common.total')}:{' '}
                        {getCurrencyString(calculateTotal(store))}
                      </Typography>
                      <IconButton
                        onClick={() => toggleDetails(store)}
                        className="p-0"
                      >
                        {operationProps.offers[store]?.open ? (
                          <ExpandMore />
                        ) : (
                          <ExpandLess />
                        )}
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Collapse in={operationProps.offers[store]?.open}>
                    <Stack spacing={1}>
                      {operationProps.offers[store]?.items
                        .filter((item) => !item.checked)
                        .map((item) => (
                          <CartItem
                            key={item.id}
                            item={item}
                            checked={item.checked}
                            handleCheckboxChange={handleCheckboxChange}
                            handleDeleteItem={handleDeleteItem}
                            getCurrencyString={getCurrencyString}
                          />
                        ))}
                      {operationProps.offers[store]?.items
                        .filter((item) => item.checked)
                        .map((item) => (
                          <CartItem
                            key={item.id}
                            item={item}
                            checked={item.checked}
                            handleCheckboxChange={handleCheckboxChange}
                            handleDeleteItem={handleDeleteItem}
                            getCurrencyString={getCurrencyString}
                          />
                        ))}
                    </Stack>
                  </Collapse>
                  {true && <Divider />}
                </Stack>
              ))}
            </Stack>
          ) : (
            <Stack alignItems="center" spacing={2} className="py-4">
              <RemoveShoppingCart color="disabled" />
              <Typography variant="h6" className="font-semibold">
                {t('offers.emptyCart')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('offers.fillCart')}
              </Typography>
            </Stack>
          )}
        </CardContent>
        <Divider />
        <CardContent>
          <Stack alignItems="end" spacing={1}>
            <Stack direction="row" spacing={4} alignItems="center">
              <Typography variant="body1" className="font-semibold">
                {t('offers.weeklyBudget')}
              </Typography>
              <Typography variant="body2" className="w-20 text-end">
                {getCurrencyString(weeklyBudget)}
              </Typography>
            </Stack>

            {storesChosen.length > 0 && (
              <Stack direction="row" spacing={4} alignItems="center">
                <Typography variant="body1" className="font-semibold">
                  {t('common.total')}
                </Typography>
                <Typography variant="body2" className="w-20 text-end">
                  {getCurrencyString(total)}
                </Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
        {storesChosen.length > 0 && (
          <CardActions className="justify-end px-4 py-2">
            <Button
              variant="contained"
              size="small"
              onClick={sendShoppingList}
              disabled={total > weeklyBudget}
            >
              {t('common.send')}
            </Button>
          </CardActions>
        )}
      </Card>
      {isGeneratingList && (
        <Box
          position="absolute"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(255, 255, 255, 0.9)"
          className="bottom-0 left-0 right-0 top-0 z-10 rounded-lg"
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={2}>
            {t('offers.generating')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

const CartItem = ({
  item,
  checked,
  handleCheckboxChange,
  handleDeleteItem,
  getCurrencyString,
}: {
  item: Offer;
  checked: boolean;
  handleCheckboxChange: (store: string, id: string, checked: boolean) => void;
  handleDeleteItem: (store: string, id: string) => void;
  getCurrencyString: (price: number) => string;
}): React.ReactNode => {
  return (
    <Stack
      key={item.item}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        overflow="hidden"
        textOverflow="ellipsis"
      >
        <Checkbox
          checked={checked}
          indeterminate={checked}
          className="p-0"
          onChange={(e) =>
            handleCheckboxChange(item.storeName, item.id, e.target.checked)
          }
        />
        <Tooltip title={item.item} placement="top" arrow>
          <Typography
            variant="body2"
            noWrap
            className={`${checked ? 'line-through' : ''} cursor-pointer`}
            onClick={() =>
              handleCheckboxChange(item.storeName, item.id, !checked)
            }
          >
            {item.item}
          </Typography>
        </Tooltip>
      </Stack>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2" color="text.secondary">
          {getCurrencyString(item.price)}
        </Typography>
        {checked && (
          <IconButton
            className="p-0"
            size="small"
            onClick={() => handleDeleteItem(item.storeName, item.id)}
          >
            <Close />
          </IconButton>
        )}
      </Box>
    </Stack>
  );
};
