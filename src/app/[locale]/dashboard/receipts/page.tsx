'use client';

import ReceiptsItemPage from '@/app/[locale]/components/dashboard/receipts/receipts-item-page';
import ReceiptsPage from '@/app/[locale]/components/dashboard/receipts/receipts-page';
import * as React from 'react';

export default function Page() {
  const [showReceiptsList, setShowReceiptsList] = React.useState(true);
  const [receiptId, setReceiptId] = React.useState('');
  const [toAdd, setToAdd] = React.useState(false);
  const [toEdit, setToEdit] = React.useState(false);

  const handleEdit = (id: string) => {
    setReceiptId(id);
    setToEdit(true);
    setShowReceiptsList(false);
  };

  const handleAdd = () => {
    setToAdd(true);
    setShowReceiptsList(false);
  };

  const returnReceiptsList = () => {
    setShowReceiptsList(true);
    setReceiptId('');
    setToAdd(false);
    setToEdit(false);
  };

  return showReceiptsList ? (
    <ReceiptsPage handleAdd={handleAdd} handleEdit={handleEdit} />
  ) : (
    <ReceiptsItemPage
      returnReceiptsList={returnReceiptsList}
      receiptId={receiptId}
      toAdd={toAdd}
      toEdit={toEdit}
    />
  );
}
