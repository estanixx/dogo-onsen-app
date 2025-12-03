import {
  BanquetTable,
  Deposit,
  InventoryItem,
  InventoryOrder,
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
  return typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000');
};

/**
 * Function to get available services
 * Returns a list of services with their details
 */
export async function getAvailableServices(query?: string): Promise<Service[]> {
  const queryParam = query ? `?q=${encodeURIComponent(query)}` : '';
  // Use an absolute URL so this works both in browser and on the server.
  const base = getBase();
  const resp = await fetch(`${base}/api/service${queryParam}`);
  const all: Service[] = await resp.json();
  return all;
}

export async function getServiceById(id: string): Promise<Service | null> {
  // Use an absolute URL so this works both in browser and on the server.
  const base = getBase();
  const resp = await fetch(`${base}/api/service/${id}`);
  const all: Service | null = await resp.json();
  return all;
}

export async function getAvailablePrivateVenues( // TODO: implement real API
  startTime: Date,
  endTime: Date,
): Promise<PrivateVenue[]> {
  const urlparams = new URLSearchParams();
  urlparams.append('startTime', startTime.toISOString());
  urlparams.append('endTime', endTime.toISOString());
  const resp = await fetch(`${getBase()}/api/private_venue?${urlparams.toString()}`);
  const venues: PrivateVenue[] = await resp.json();
  return venues;
}

/**
 * Function to get the current venue account for a room
 * Returns account details including spirit ID and time information
 */
export async function getCurrentVenueAccount(roomId: string): Promise<VenueAccount | null> {
  const resp = await fetch(`${getBase()}/api/venue_account/room/${roomId}`);
  const account: VenueAccount | null = await resp.json();
  return account;
}
/** * Function to get venue account details by ID
 */
export async function getVenueAccountById(venueId: string): Promise<VenueAccount | null> {
  const resp = await fetch(`${getBase()}/api/venue_account/${venueId}`);
  if (!resp.ok) {
    return null;
  }
  const account: VenueAccount | null = await resp.json();
  return account;
}

/**
 * Function to get spirit details by ID
 */
export async function getSpirit(spiritId: string): Promise<Spirit | null> {
  const resp = await fetch(`${getBase()}/api/spirit/${spiritId}`);
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
  const resp = await fetch(`${getBase()}/api/spirit_type/${typeId}`);
  const type: SpiritType | null = await resp.json();
  console.log(type, typeId);
  return type;
}

export async function getAllSpiritTypes(): Promise<SpiritType[]> {
  const resp = await fetch(`${getBase()}/api/spirit_type/`);
  const types: SpiritType[] = await resp.json();
  return types;
}

/**
 * Function to get available time slots for a service on a specific date
 */
export async function getAvailableTimeSlotsForService(
  serviceId: string,
  date: Date,
): Promise<string[]> {
  const resp = await fetch(
    `${getBase()}/api/service/${serviceId}/available_time_slots?date=${date.toISOString()}`,
  );
  const slots: string[] = await resp.json();
  return slots;
}

export async function getTimeSlots(): Promise<string[]> {
  const resp = await fetch(`${getBase()}/api/time-slots`);
  const slots: string[] = await resp.json();
  return slots;
}

/**
 * Function to get available time slots for a spirit at the banquet on a specific date
 */
export async function getAvailableTimeSlotsForBanquet(
  spiritId: string,
  date: Date,
): Promise<string[]> {
  const resp = await fetch(
    `${getBase()}/api/banquet/${spiritId}/available_time_slots?date=${date.toISOString()}`,
  );
  const slots: string[] = await resp.json();
  return slots;
}

export async function createSpirit(
  // id: string,
  name: string,
  typeId: string,
  image?: string,
): Promise<Spirit> {
  // Simulate creating a new spirit
  console.log(image);
  const resp = await fetch(`${getBase()}/api/spirit/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // id,
      name,
      typeId,
      type: (await getSpiritType(typeId)) as SpiritType,
      individualRecord: new Date().toISOString(),
      image,
    }),
  });
  const spirit: Spirit = await resp.json();
  console.log(spirit);
  return spirit;
}

export async function getBanquetReservationsForDate(date: string) {
  const resp = await fetch(`${getBase()}/api/reservation/banquet-by-date`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date }),
  });
  const reservations: {
    id: string;
    tableId: string;
    seatNumber: number;
    date: string; // ISO date
    time: string; // HH:MM
    accountId?: string;
  }[] = await resp.json();
  return reservations;
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
  console.log(
    JSON.stringify({
      seatId,
      startTime,
      endTime: new Date(startTime.getTime() + 60 * 60 * 1000),
      accountId,
    }),
  );
  const resp = await fetch(`${getBase()}/api/reservation/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      seatId,
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
  const datetime = createDatetimeFromDateAndTime(date, time);
  const resp = await fetch(`${getBase()}/api/banquet/table/available/${spiritId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      datetime: datetime,
    }),
  });
  const seats: BanquetTable[] = await resp.json();
  console.log('Response from banquet seats API:', seats);
  return seats;
}

/**
 * Function to get all the registered spirits
 */
export async function getAllSpirits(): Promise<Spirit[]> {
  const resp = await fetch(`${getBase()}/api/spirit/`);
  const spirits: Spirit[] = await resp.json();
  return spirits;
}

/**
 * Update a spirit with partial data (uses PUT /api/spirit/{id})
 */
export async function updateSpirit(
  spiritId: string,
  update: Partial<Spirit>,
): Promise<Spirit | null> {
  const resp = await fetch(`${getBase()}/api/spirit/${spiritId}`, {
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
  const resp = await fetch(`${getBase()}/api/deposit/`, {
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
  const resp = await fetch(`${getBase()}/api/deposit/account/${encodeURIComponent(accountId)}`);
  if (!resp.ok) {
    throw new Error('Failed to fetch deposits for account');
  }
  const deposits: Deposit[] = await resp.json();
  return deposits;
}

// Mock data for inventory
const mockInventoryItems: InventoryItem[] = [
  { id: '1', name: 'Toallas', quantity: 45, unit: 'unidades' },
  { id: '2', name: 'Sales de baño', quantity: 15, unit: 'kg' },
  { id: '3', name: 'Jabón líquido', quantity: 8, unit: 'litros' },
  { id: '4', name: 'Incienso', quantity: 30, unit: 'paquetes' },
  { id: '5', name: 'Velas aromáticas', quantity: 25, unit: 'unidades' },
  { id: '6', name: 'Té verde', quantity: 5, unit: 'kg' },
];

/**
 * Function to get all inventory items
 */
export async function getInventoryItems(): Promise<InventoryItem[]> {
  // Simulate API call
  await wait(1000);
  return mockInventoryItems;
}

/**
 * Function to create a new order and inventory orders
 */
export async function createOrder(
  items: { idOrder: string; idItem: number; quantity: number }[],
  options?: { idEmployee?: string; orderDate?: string; deliveryDate?: string },
): Promise<Order> {
  const fetchWithTimeout = async (url: string, init?: RequestInit, timeout = 8_000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const resp = await fetch(url, { ...init, signal: controller.signal });
      return resp;
    } finally {
      clearTimeout(id);
    }
  };

  try {
    // 1) Create Order on backend
    const orderPayload = {
      idEmployee: options?.idEmployee ?? 'unknown',
      orderDate: options?.orderDate ?? new Date().toISOString(),
      deliveryDate: options?.deliveryDate ?? new Date().toISOString(),
    };

    const orderResp = await fetchWithTimeout(`${getBase()}/api/order/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    if (!orderResp.ok) {
      const errText = await orderResp.text();
      throw new Error(`Backend failed to create order: ${orderResp.status} ${errText}`);
    }

    const createdOrder = await orderResp.json();

    // 2) For each item create an InventoryOrder record linked to the order
    await Promise.all(
      items.map(async (it) => {
        const invPayload = {
          idOrder: createdOrder.id,
          idItem: it.idItem,
          quantity: it.quantity,
        } as InventoryOrder;

        const invResp = await fetchWithTimeout(`${getBase()}/api/inventory_order/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invPayload),
        });

        if (!invResp.ok) {
          const errText = await invResp.text();
          throw new Error(`Backend failed to create inventory_order: ${invResp.status} ${errText}`);
        }
      }),
    );

    // 3) Fetch the order back and map to Order shape
    const getOrderResp = await fetchWithTimeout(
      `${getBase()}/api/order/${encodeURIComponent(createdOrder.id)}`,
    );
    const fullOrder = getOrderResp.ok ? await getOrderResp.json() : createdOrder;

    // Map backend order to frontend Order type
    const mapped: Order = {
      id: String(fullOrder.id ?? createdOrder.id),
      items: (fullOrder.items || []).map((i: InventoryOrder) => ({
        idOrder: String(fullOrder.id),
        idItem: i.idItem,
        quantity: i.quantity,
      })),
      orderDate: fullOrder.orderDate ?? new Date().toISOString(),
      deliveryDate: fullOrder.deliveryDate ?? new Date().toISOString(),
    };

    return mapped;
  } catch (e) {
    console.warn('createOrder backend flow failed, falling back to mock:', e);
    await wait(1500);
    return {
      id: Math.random().toString(36).substring(2, 9),
      items,
      orderDate: options?.orderDate ?? new Date().toISOString(),
      deliveryDate: options?.deliveryDate ?? new Date().toISOString(),
    };
  }
}

/**
 * Function to update inventory quantities
 */
export async function updateInventoryQuantity(
  itemId: string,
  newQuantity: number,
): Promise<InventoryItem> {
  // Simulate API call
  await wait(800);

  // Find the item in our mock data
  const itemIndex = mockInventoryItems.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    throw new Error('Item not found');
  }

  // Update the quantity
  mockInventoryItems[itemIndex].quantity = newQuantity;

  return mockInventoryItems[itemIndex];
}

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
  const resp = await fetch(`${getBase()}/api/reservation?${queryParams.toString()}`);
  const reservations: Reservation[] = await resp.json();
  return reservations;
}

export async function updateReservation(
  id: string,
  reservation: Partial<Reservation>,
): Promise<Reservation | null> {
  const resp = await fetch(`${getBase()}/api/reservation/${id}`, {
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
  const resp = await fetch(`${getBase()}/api/reservation/${id}`, {
    method: 'DELETE',
  });
  return resp.ok;
}

/**
 * Function to get all banquet tables
 */
export async function getBanquetTables(): Promise<BanquetTable[]> {
  const resp = await fetch(`${getBase()}/api/banquet/table`);
  const tables: BanquetTable[] = await resp.json();
  return tables;
}

/**
 * Fetch orders from backend (raw response). Backend will already filter active orders
 * when the server-side service is configured to do so. We return the raw backend
 * payload so callers can inspect `orderDate` and `deliveryDate`.
 */
export async function getOrdersRaw(): Promise<Order[]> {
  const resp = await fetch(`${getBase()}/api/order/`);
  if (!resp.ok) {
    return [];
  }
  const orders = await resp.json();
  return orders;
}

export async function createService(service: Service): Promise<Service | null> {
  const resp = await fetch(`${getBase()}/api/service/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(service),
  });
  if (!resp.ok) {
    return null;
  }
  const createdService: Service = await resp.json();
  return createdService;
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
  const resp = await fetch(`${getBase()}/api/reservation`, {
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
  spiritId: string;
  privateVenueId: string;
  startTime: Date;
  endTime: Date;
}): Promise<VenueAccount | null> {
  const resp = await fetch(`${getBase()}/api/venue_account/`, {
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
  if (!resp.ok) {
    return null;
  }
  const createdAccount: VenueAccount = await resp.json();
  return createdAccount;
}
