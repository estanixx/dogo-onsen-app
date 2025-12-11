'use server';
import {
  BanquetTable,
  DashboardData,
  Deposit,
  InventoryOrder,
  Item,
  ItemIntake,
  Order,
  PrivateVenue,
  Reservation,
  Service,
  Spirit,
  SpiritType,
  VenueAccount,
} from '../types';
import { createDatetimeFromDateAndTime, wait } from '../utils';

const getBase = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8004';
};

/**
 * Function to get available services
 * Returns a list of services with their details
 */
export async function getAvailableServices(query?: string): Promise<Service[]> {
  try {
    const queryParam = query ? `?q=${encodeURIComponent(query)}` : '';
    // Use an absolute URL so this works both in browser and on the server.
    const base = getBase();
    console.log(`Fetching services from: ${base}/service${queryParam}`);
    const resp = await fetch(`${base}/service${queryParam}`);

    if (!resp.ok) {
      console.error(`Failed to fetch services: ${resp.status} ${resp.statusText}`);
      return [];
    }

    const all: Service[] = await resp.json();
    return all;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  // Use an absolute URL so this works both in browser and on the server.
  const base = getBase();
  const resp = await fetch(`${base}/service/${id}`);
  const all: Service | null = await resp.json();
  return all;
}

export async function getAvailablePrivateVenues( // TODO: implement real API
  startTime: Date,
  endTime: Date,
): Promise<PrivateVenue[]> {
  try {
    const urlparams = new URLSearchParams();
    urlparams.append('startTime', startTime.toISOString());
    urlparams.append('endTime', endTime.toISOString());
    const resp = await fetch(`${getBase()}/private_venue?${urlparams.toString()}`);
    if (!resp.ok) {
      return [];
    }
    const venues: PrivateVenue[] = await resp.json();
    return venues;
  } catch (error) {
    console.error('Error fetching private venues:', error);
    return [];
  }
}

/**
 * Function to get the current venue account for a room
 * Returns account details including spirit ID and time information
 */
export async function getCurrentVenueAccount(roomId: string): Promise<VenueAccount | null> {
  const resp = await fetch(`${getBase()}/venue_account/room/${roomId}`);
  const account: VenueAccount | null = await resp.json();
  return account;
}
/** * Function to get venue account details by ID
 */
export async function getVenueAccountById(venueId: string): Promise<VenueAccount | null> {
  const resp = await fetch(`${getBase()}/venue_account/${venueId}`);
  if (!resp.ok) {
    return null;
  }
  const account: VenueAccount | null = await resp.json();
  return account;
}

/**
 * Function to get spirit details by ID
 */
export async function getSpirit(spiritId: number): Promise<Spirit | null> {
  const resp = await fetch(`${getBase()}/spirit/${spiritId}`);
  const spirit: Spirit | null = await resp.json();
  if (!resp.ok) {
    return null;
  }
  return spirit;
}

/**
 * Function to get spirit type details by ID
 */
export async function getSpiritType(typeId: string): Promise<SpiritType | null> {
  const resp = await fetch(`${getBase()}/spirit_type/${typeId}`);
  const type: SpiritType | null = await resp.json();
  return type;
}

export async function getAllSpiritTypes(): Promise<SpiritType[]> {
  try {
    const resp = await fetch(`${getBase()}/spirit_type/`);
    if (!resp.ok) {
      return [];
    }
    const types: SpiritType[] = await resp.json();
    return types;
  } catch (error) {
    console.error('Error fetching spirit types:', error);
    return [];
  }
}

/**
 * Function to get available time slots for a service on a specific date
 */
export async function getAvailableTimeSlotsForService(
  serviceId: string,
  date: Date,
): Promise<string[]> {
  try {
    const resp = await fetch(
      `${getBase()}/service/${serviceId}/available_time_slots?date=${date.toISOString()}`,
    );
    if (!resp.ok) {
      return [];
    }
    const slots: string[] = await resp.json();
    return slots;
  } catch (error) {
    console.error('Error fetching service time slots:', error);
    return [];
  }
}

export async function getTimeSlots(): Promise<string[]> {
  try {
    const resp = await fetch(`${getBase()}/time-slots`);
    if (!resp.ok) {
      return [];
    }
    const slots: string[] = await resp.json();
    return slots;
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return [];
  }
}

/**
 * Function to get available time slots for a spirit at the banquet on a specific date
 */
export async function getAvailableTimeSlotsForBanquet(
  spiritId: string,
  date: Date,
): Promise<string[]> {
  try {
    const resp = await fetch(
      `${getBase()}/banquet/${spiritId}/available_time_slots?date=${date.toISOString()}`,
    );
    if (!resp.ok) {
      return [];
    }
    const slots: string[] = await resp.json();
    return slots;
  } catch (error) {
    console.error('Error fetching banquet time slots:', error);
    return [];
  }
}

export async function createSpirit(
  id: number,
  name: string,
  typeId: string,
  image?: string,
): Promise<Spirit> {
  // Simulate creating a new spirit
  const resp = await fetch(`${getBase()}/spirit/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      name,
      typeId,
      individualRecord: new Date().toISOString(),
      image,
    }),
  });
  const spirit: Spirit = await resp.json();
  return spirit;
}

export async function getBanquetReservationsForDate(date: string) {
  try {
    const resp = await fetch(`${getBase()}/reservation/banquet-by-date`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }),
    });
    if (!resp.ok) {
      return [];
    }
    const reservations: {
      id: string;
      tableId: string;
      seatNumber: number;
      date: string; // ISO date
      time: string; // HH:MM
      accountId?: string;
    }[] = await resp.json();
    return reservations;
  } catch (error) {
    console.error('Error fetching banquet reservations:', error);
    return [];
  }
}

export async function createBanquetReservation({
  seatId,
  date,
  time,
  accountId,
}: {
  seatId: number;
  date: Date;
  time: string;
  accountId?: string;
}) {
  // Combine date (YYYY-MM-DD) and time (HH:mm)
  const startTime = createDatetimeFromDateAndTime(date, time);
  const resp = await fetch(`${getBase()}/reservation/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      seatId,
      serviceId: 'banquete',
      startTime,
      endTime: new Date(startTime.getTime() + 60 * 60 * 1000),
      accountId,
    }),
  });
  if (!resp.ok) {
    return null;
  }
  const reservation = await resp.json();
  return reservation;
}

export async function getAvailableBanquetSeats(
  spiritId: string,
  date: Date,
  time: string,
): Promise<BanquetTable[]> {
  try {
    const datetime = createDatetimeFromDateAndTime(date, time);
    const resp = await fetch(`${getBase()}/banquet/table/available/${spiritId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        datetime: datetime,
      }),
    });
    if (!resp.ok) {
      return [];
    }
    const seats: BanquetTable[] = await resp.json();
    return seats;
  } catch (error) {
    console.error('Error fetching available banquet seats:', error);
    return [];
  }
}

/**
 * Function to get all the registered spirits
 */
export async function getAllSpirits(): Promise<Spirit[]> {
  try {
    const base = getBase();
    console.log(`Fetching spirits from: ${base}/spirit/`);
    const resp = await fetch(`${base}/spirit/`);

    if (!resp.ok) {
      console.error(`Failed to fetch spirits: ${resp.status} ${resp.statusText}`);
      return [];
    }

    const spirits: Spirit[] = await resp.json();
    return spirits;
  } catch (error) {
    console.error('Error fetching spirits:', error);
    return [];
  }
}

/**
 * Update a spirit with partial data (uses PUT /spirit/{id})
 */
export async function updateSpirit(
  spiritId: string,
  update: Partial<Spirit>,
): Promise<Spirit | null> {
  const resp = await fetch(`${getBase()}/spirit/${spiritId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  });
  if (!resp.ok) {
    return null;
  }
  const spirit: Spirit = await resp.json();
  return spirit;
}

/**
 * Create a deposit record for a venue account
 */
export async function createDeposit(accountId: string, amount: number): Promise<Deposit> {
  const resp = await fetch(`${getBase()}/deposit/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountId,
      amount,
      date: new Date().toISOString(),
    }),
  });
  if (!resp.ok) {
    throw new Error('Failed to create deposit');
  }
  const deposit: Deposit = await resp.json();
  return deposit;
}

export async function getDepositsForAccount(accountId: string): Promise<Deposit[]> {
  try {
    const resp = await fetch(`${getBase()}/deposit/account/${encodeURIComponent(accountId)}`);
    if (!resp.ok) {
      console.warn('Failed to fetch deposits for account');
      return [];
    }
    const deposits: Deposit[] = await resp.json();
    return deposits;
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return [];
  }
}

/**
 * Function to get a single item by its ID from the backend
 */
export async function getItems(): Promise<Item[]> {
  try {
    const resp = await fetch(`${getBase()}/item/`);
    if (!resp.ok) {
      console.warn(`Failed to fetch items: ${resp.status} ${resp.statusText}`);
      return [];
    }
    const items: Item[] = await resp.json();
    return items;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

/**
 * Function to get a single item by its ID from the backend
 */
export async function getItem(
  itemId: number,
): Promise<{ id: number; name: string; image?: string } | null> {
  const resp = await fetch(`${getBase()}/item/${itemId}`);
  if (!resp.ok) {
    return null;
  }
  const item = await resp.json();
  return item;
}

/**
 * Function to create a new order and inventory orders
 */

export async function createOrder(
  items: { idItem: number; quantity: number }[],
  options?: { idEmployee?: string; orderDate?: string; deliveryDate?: string },
): Promise<Order> {
  const FETCH_TIMEOUT_MS = 5000;
  const baseUrl = getBase();

  // Helper for fetch with timeout
  const fetchWithTimeout = async (url: string, init?: RequestInit) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    // Unified backend endpoint: create order and lines atomically
    const payload = {
      order: {
        idEmployee: options?.idEmployee ?? 'unknown',
        orderDate: options?.orderDate ?? new Date().toISOString(),
        deliveryDate: options?.deliveryDate ?? new Date().toISOString(),
      },
      items: items.map((it) => ({ idItem: it.idItem, quantity: it.quantity })),
    };
    const resp = await fetchWithTimeout(`${baseUrl}/order/with_items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Order + items creation failed: ${resp.status} ${errText}`);
    }

    const createdOrder: Order = await resp.json();
    return createdOrder;
  } catch (e) {
    // FALLBACK logic if backend fails
    console.warn('createOrder backend flow failed, falling back to mock:', e);

    // Optional delay to simulate backend lag during fallback
    await wait(1500);

    const fallbackId = Math.floor(Math.random() * 1000000);
    return {
      id: fallbackId,
      items: items.map((it) => ({ idOrder: fallbackId, idItem: it.idItem, quantity: it.quantity })),
      orderDate: options?.orderDate ?? new Date().toISOString(),
      deliveryDate: options?.deliveryDate ?? new Date().toISOString(),
    };
  }
}

/**
 * Function to update inventory quantities
 */
// export async function updateInventoryQuantity(
//   itemId: string,
//   newQuantity: number,
// ): Promise<InventoryItem> {
//   // Simulate API call
//   await wait(800);

//   // Find the item in our mock data
//   const itemIndex = mockInventoryItems.findIndex((item) => item.id === itemId);
//   if (itemIndex === -1) {
//     throw new Error('Item not found');
//   }

//   // Update the quantity
//   mockInventoryItems[itemIndex].quantity = newQuantity;

//   return mockInventoryItems[itemIndex];
// }

/**
 * Function to get all the reservations for a given date and time slot
 */
export async function getReservations({
  accountId,
  serviceId,
  date,
  timeSlot,
}: {
  serviceId?: string;
  date?: string;
  timeSlot?: string;
  accountId?: string;
}): Promise<Reservation[]> {
  try {
    const datetime =
      date && timeSlot
        ? createDatetimeFromDateAndTime(new Date(date), timeSlot).toISOString()
        : date
          ? new Date(date).toISOString()
          : undefined;

    const queryParams = new URLSearchParams();
    if (serviceId) {
      queryParams.append('serviceId', serviceId);
    }
    if (accountId) {
      queryParams.append('accountId', accountId);
    }
    if (datetime) {
      queryParams.append('datetime', datetime);
    }
    const resp = await fetch(`${getBase()}/reservation?${queryParams.toString()}`);
    if (!resp.ok) {
      return [];
    }
    const reservations: Reservation[] = await resp.json();
    return reservations;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
}

export async function updateReservation(
  id: string,
  reservation: Partial<Reservation>,
): Promise<Reservation | null> {
  const resp = await fetch(`${getBase()}/reservation/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservation),
  });
  if (!resp.ok) {
    return null;
  }
  const updatedReservation: Reservation = await resp.json();
  return updatedReservation;
}

export async function removeReservation(id: string): Promise<boolean> {
  const resp = await fetch(`${getBase()}/reservation/${id}`, {
    method: 'DELETE',
  });
  return resp.ok;
}

/**
 * Function to get all banquet tables
 */
export async function getBanquetTables(): Promise<BanquetTable[]> {
  try {
    const resp = await fetch(`${getBase()}/banquet/table`);
    if (!resp.ok) {
      return [];
    }
    const tables: BanquetTable[] = await resp.json();
    return tables;
  } catch (error) {
    console.error('Error fetching banquet tables:', error);
    return [];
  }
}

/**
 * Fetch inventory orders from backend.
 */
export async function getInventoryOrders(): Promise<InventoryOrder[]> {
  try {
    const resp = await fetch(`${getBase()}/inventory_order/`);
    if (!resp.ok) {
      console.warn(`getInventoryOrders: ${resp.status} ${resp.statusText}`);
      return [];
    }
    const lines = await resp.json();
    return lines;
  } catch (error) {
    console.error('Error fetching inventory orders:', error);
    return [];
  }
}

/**
 * Fetch orders from backend (raw response). Backend will already filter active orders
 * when the server-side service is configured to do so. We return the raw backend
 * payload so callers can inspect `orderDate` and `deliveryDate`.
 */
export async function getOrdersRaw(): Promise<Order[]> {
  try {
    const resp = await fetch(`${getBase()}/order/`);
    if (!resp.ok) {
      console.warn(`getOrdersRaw: ${resp.status} ${resp.statusText}`);
      return [];
    }
    const orders = await resp.json();
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

/**
 * Enrich orders with their items by fetching all inventory orders and grouping by idOrder.
 */
export async function enrichOrdersWithItems(orders: Order[]): Promise<Order[]> {
  try {
    const allLines = await getInventoryOrders();
    const linesByOrder: Record<number, InventoryOrder[]> = {};
    allLines.forEach((line) => {
      const oid = typeof line.idOrder === 'string' ? parseInt(line.idOrder, 10) : line.idOrder;
      if (!linesByOrder[oid]) {
        linesByOrder[oid] = [];
      }
      linesByOrder[oid].push(line);
    });
    return orders.map((o) => ({
      ...o,
      items: linesByOrder[o.id] || [],
    }));
  } catch (error) {
    console.error('Error enriching orders:', error);
    // Return orders with empty items if enrichment fails
    return orders.map((o) => ({
      ...o,
      items: o.items || [],
    }));
  }
}

export async function createService(service: Service): Promise<Service | null> {
  try {
    const resp = await fetch(`${getBase()}/service/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(service),
    });
    if (!resp.ok) {
      console.warn(`Failed to create service: ${resp.status} ${resp.statusText}`);
      return null;
    }
    const createdService: Service = await resp.json();
    return createdService;
  } catch (error) {
    console.error('Error creating service:', error);
    return null;
  }
}

/**
 * Create an item intake (assign items to a service or seat)
 */
export async function createItemIntake(intake: {
  itemId: number;
  quantity: number;
  serviceId?: string;
  seatId?: number | null;
}): Promise<ItemIntake | null> {
  try {
    const resp = await fetch(`${getBase()}/item_intake/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intake),
    });
    if (!resp.ok) {
      console.warn('createItemIntake failed', resp.status, resp.statusText);
      return null;
    }
    const created = await resp.json();
    return created ?? null;
  } catch (error) {
    console.error('Error creating item intake:', error);
    return null;
  }
}

export async function createServiceReservation({
  serviceId,
  accountId,
  date,
  timeSlot,
}: {
  serviceId: string;
  accountId: string;
  date: Date;
  timeSlot: string;
}): Promise<Reservation | null> {
  const startTime = createDatetimeFromDateAndTime(date, timeSlot);
  const resp = await fetch(`${getBase()}/reservation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serviceId,
      accountId,
      startTime,
      endTime: new Date(startTime.getTime() + 60 * 60 * 1000),
    }),
  });
  if (!resp.ok) {
    return null;
  }
  const createdReservation: Reservation = await resp.json();
  if (!resp.ok) {
    return null;
  }
  return createdReservation;
}

export async function createVenueAccount({
  spiritId,
  privateVenueId,
  startTime,
  endTime,
}: {
  spiritId: number;
  privateVenueId: string;
  startTime: Date;
  endTime: Date;
}): Promise<VenueAccount | { detail: string } | null> {
  const resp = await fetch(`${getBase()}/venue_account/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spiritId,
      privateVenueId,
      startTime,
      endTime,
    }),
  });

  const createdAccount: VenueAccount = await resp.json();
  return createdAccount;
}

export async function getDashboardData(): Promise<DashboardData | null> {
  const resp = await fetch(`${getBase()}/dashboard`);
  const data: DashboardData = await resp.json();
  if (!resp.ok) {
    return null;
  }
  return data;
}

/**
 * Function to redeem an order (mark all inventory orders as redeemed)
 */
export async function redeemOrder(orderId: number): Promise<Order | null> {
  const resp = await fetch(`${getBase()}/order/${orderId}/redeem`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!resp.ok) {
    return null;
  }
  const updatedOrder: Order = await resp.json();
  return updatedOrder;
}

/**
 * Verify if a service has sufficient stock to fulfill a reservation
 * @param serviceId - The ID of the service to check
 * @returns Object with isAvailable flag and details about missing items
 */
export async function verifyServiceItemAvailability(serviceId: string): Promise<{
  isAvailable: boolean;
  insufficientItems: Array<{
    itemId: number;
    itemName: string;
    requiredQuantity: number;
    availableQuantity: number;
  }>;
  message: string;
} | null> {
  try {
    const base = getBase();
    const url = `${base}/service/${serviceId}/check-availability`;

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error(`[API] Error checking availability: ${resp.status}`);
      return null;
    }

    const result = await resp.json();
    return result;
  } catch (error) {
    console.error('[API] Exception checking availability:', error);
    return null;
  }
}
