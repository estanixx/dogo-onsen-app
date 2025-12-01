import {
  BanquetTable,
  Deposit,
  InventoryItem,
  InventoryOrder,
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
  return [
    {
      id: '1',
      state: true,
    },
    {
      id: '2',
      state: true,
    },
    {
      id: '3',
      state: true,
    },
    {
      id: '4',
      state: false,
    },
    {
      id: '5',
      state: true,
    },
  ];
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

// In-memory reservations for banquet seats
const banquetReservations: {
  id: string;
  tableId: string;
  seatNumber: number;
  date: string; // ISO date
  time: string; // HH:MM
  accountId?: string;
}[] = [];

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
 * Function to create a new inventory order
 */
export async function createInventoryOrder(
  items: { productId: string; quantity: number }[],
): Promise<InventoryOrder> {
  // Simulate API call
  await wait(1500);

  // In a real app, this would send data to the backend
  // For now, we just return a mock response
  return {
    id: Math.random().toString(36).substring(2, 9),
    items,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
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

// Mock employee data
const mockEmployees = [
  {
    id: '1',
    username: 'admin',
    name: 'Admin',
    pin: '1234',
    role: 'admin',
  },
  {
    id: '2',
    username: 'reception',
    name: 'Reception',
    pin: '5678',
    role: 'reception',
  },
];
/**
 * Function to register a new employee (dummy, in-memory)
 */
export async function registerEmployee({
  username,
  name,
  pin,
  role,
}: {
  username: string;
  name: string;
  pin: string;
  role?: string;
}) {
  await wait(500);
  if (mockEmployees.some((emp) => emp.username === username)) {
    throw new Error('El usuario ya existe');
  }
  const newEmployee = {
    id: (mockEmployees.length + 1).toString(),
    username,
    name,
    pin,
    role: role || 'employee',
  };
  mockEmployees.push(newEmployee);
  // Don't send pin back
  const { pin: _, username: __, ...employeeData } = newEmployee;
  return employeeData;
}

/**
 * Function to authenticate an employee by username and PIN
 */
export async function authenticateEmployee(username: string, pin: string) {
  await wait(500);
  const employee = mockEmployees.find((emp) => emp.username === username && emp.pin === pin);
  if (!employee) {
    return null;
  }

  // Don't send the PIN and username in the response
  const { pin: _, username: __, ...employeeData } = employee;
  return employeeData;
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
        ? date
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
  console.log(
    JSON.stringify({
      serviceId,
      accountId,
      startTime,
      endTime: new Date(startTime.getTime() + 60 * 60 * 1000),
    }),
  );
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
