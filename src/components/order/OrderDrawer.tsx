"use client";

import { useEffect, useState } from "react";
import {
  getVendorOrderById,
  VendorOrder,
} from "@/api/order.api";
import OrderStatusActions from "./OrderStatusActions";

type Props = {
  orderId: string | null;
  onClose: () => void;
};

export default function OrderDrawer({ orderId, onClose }: Props) {
  const [order, setOrder] = useState<VendorOrder | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    setLoading(true);
    getVendorOrderById(orderId)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-full sm:w-[420px] h-full bg-white flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 border-b flex justify-between">
          <div>
            <div className="text-xs text-gray-500">Order</div>
            <div className="font-semibold">
              #{orderId.slice(-6)}
            </div>
          </div>
          <button onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && <div>Loading…</div>}

          {order && (
            <>
              {/* Items */}
              {order.items && (
                <div>
                  <h3 className="font-medium mb-2">Items</h3>
                  <ul className="space-y-1">
                    {order.items.map((i, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between"
                      >
                        <span>{i.name}</span>
                        <span>× {i.qty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              {order.instructions && (
                <div>
                  <h3 className="font-medium">Instructions</h3>
                  <p className="text-sm italic text-gray-600">
                    {order.instructions}
                  </p>
                </div>
              )}

              {/* Session / Table */}
              <div className="text-sm text-gray-600">
                {order.sessionId && (
                  <div>Session: {order.sessionId}</div>
                )}
                {order.tableLabel && (
                  <div>Table: {order.tableLabel}</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {order && (
          <div className="p-4 border-t">
            <OrderStatusActions
              orderId={order.id}
              status={order.status}
              onSuccess={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}
