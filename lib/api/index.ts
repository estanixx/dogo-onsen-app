import { get } from 'http';
import {
  PrivateVenue,
  Reservation,
  Service,
  Spirit,
  SpiritType,
  VenueAccount,
  BanquetTable,
  InventoryItem,
  InventoryOrder,
} from '../types';
import { wait } from '../utils';
import { TIME_SLOTS } from './constants';

/**
 * Function to get available services
 * Returns a list of services with their details
 */
export async function getAvailableServices(query?: string): Promise<Service[]> {
  await wait(1000); // Simulate network delay
  const all: Service[] = [
    {
      eiltRate: 50,
      id: '1',
      name: 'Banquete',
      description: 'Un banquete donde podrás disfrutar de deliciosos platillos.',
      rating: 4.7,
      image:
        'https://media.istockphoto.com/id/495329828/es/foto/tostado-casero-del-d%C3%ADa-de-acci%C3%B3n-de-gracias-de-turqu%C3%ADa.jpg?s=612x612&w=0&k=20&c=5JwMBcNXS4lIDWp5a5ojJDEf-f-xraaIIXLQl_Vu2to=',
    },
    {
      eiltRate: 50,
      id: '2',
      name: 'Masaje relajante',
      description: 'Un masaje relajante para relajarse y descansar.',
      rating: 4.8,
      image:
        'https://media.istockphoto.com/id/1357320952/es/foto/primer-plano-de-un-hombre-recibiendo-masaje.jpg?s=612x612&w=0&k=20&c=CfWa3f91Ylq3u69hezJrOczxSpphtTl1xnHUvNe1pXA=',
    },
    {
      eiltRate: 80,
      id: '3',
      name: 'Tratamiento facial',
      description: 'Un tratamiento facial rejuvenecedor para tener una piel brillante.',
      rating: 4.6,
      image: 'https://leonardmedispa.com/wp-content/uploads/2017/03/facial-86487979-1.jpg',
    },
    {
      eiltRate: 999,
      id: '4',
      name: 'Exorcismo',
      description: 'Una sesión de exorcismo para una limpieza espiritual.',
      rating: 4.2,
      image:
        'https://www.sublimehorror.com/wp-content/uploads/2019/03/medieval-representations-of-exorcism-in-art.jpg',
    },
    {
      eiltRate: 2900,
      id: '5',
      name: 'Sesión de brujería',
      description: 'Una sesión mística de brujería para necesidades especiales.',
      rating: 4.9,
      image:
        'https://media.cnn.com/api/v1/images/stellar/prod/211030185915-05-witchcraft-taschen-witch-symbolism-art.jpg?q=w_1110,c_fill',
    },
  ];

  if (!query) {
    return all;
  }

  const q = query.toLowerCase().trim();
  return all.filter((s) => s.name.toLowerCase().includes(q));
}

export async function getServiceById(id: string): Promise<Service | null> {
  const services = await getAvailableServices();
  const service = services.find((s) => s.id === id);
  return service ?? null;
}

export async function getAvailablePrivateVenues(
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
export async function getCurrentVenueAcount(venueId: string): Promise<VenueAccount | null> {
  return {
    id: '1',
    spiritId: '007',
    spirit: (await getSpirit('007')) as Spirit,
    venueId: venueId,
    startTime: new Date('2025-10-25'),
    endTime: new Date('2025-10-30'),
  };
}

/**
 * Function to get spirit details by ID
 */
export async function getSpirit(spiritId: string): Promise<Spirit | null> {
  return {
    id: spiritId,
    name: 'Agente ' + spiritId,
    typeId: '1',
    type: (await getSpiritType('1')) as SpiritType,
    accountId: '1',
    eiltBalance: 200,
    individualRecord: new Date().toISOString(),
    image:
      'https://static.wikia.nocookie.net/hitman/images/e/ec/Agent_47_in_Hitman_2016.png/revision/latest/scale-to-width/360?cb=20230124042322',
  };
}

/**
 * Function to get spirit type details by ID
 */
export async function getSpiritType(typeId: string): Promise<SpiritType | null> {
  return {
    id: typeId,
    name: 'Agente Secreto',
    dangerScore: 90,
  };
}

export async function getAllSpiritTypes(): Promise<SpiritType[]> {
  return [
    {
      id: '1',
      name: 'Agente Secreto',
      dangerScore: 90,
    },
    {
      id: '2',
      name: 'Fantasma amigable',
      dangerScore: 10,
    },
    {
      id: '3',
      name: 'Espíritu travieso',
      dangerScore: 50,
    },
    {
      id: '4',
      name: 'Alma en pena',
      dangerScore: 70,
    },
  ];
}

/**
 * Function to get available time slots for a service on a specific date
 */
export async function getAvailableTimeSlots(serviceId: string, date: Date): Promise<string[]> {
  // Simulate fetching from server
  await wait(500);
  return TIME_SLOTS;
}

/**
 * Function to book a service for a venue account at a specific date and time
 */
export async function bookService(
  serviceId: string,
  accountId: string,
  date: Date,
  time: string,
): Promise<Reservation> {
  // Simulate booking a service
  await wait(500);
  return {
    id: '1',
    serviceId,
    accountId,
    startTime: date,
    endTime: new Date(date.getTime() + 60 * 60 * 1000), // 1 hour later
    isRedeemed: false,
    isRated: false,
    account: (await getCurrentVenueAcount('venue1')) as VenueAccount,
  };
}

export async function createSpirit(
  id: string,
  name: string,
  typeId: string,
  image?: string,
): Promise<Spirit> {
  // Simulate creating a new spirit
  await wait(500);
  return {
    id,
    name,
    typeId,
    type: (await getSpiritType(typeId)) as SpiritType,
    eiltBalance: 0,
    individualRecord: new Date().toISOString(),
    image,
  };
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
  await wait(200);
  return banquetReservations.filter((r) => r.date === date);
}

export async function createBanquetReservation({
  tableId,
  seatNumber,
  date,
  time,
  accountId,
}: {
  tableId: string;
  seatNumber: number;
  date: string;
  time: string;
  accountId?: string;
}) {
  await wait(300);
  // check if seat is already reserved for that date/time
  const exists = banquetReservations.some(
    (r) =>
      r.tableId === tableId && r.seatNumber === seatNumber && r.date === date && r.time === time,
  );
  if (exists) {
    throw new Error('Seat already reserved for that slot');
  }

  const id = Math.random().toString(36).slice(2, 9);
  const reservation = { id, tableId, seatNumber, date, time, accountId };
  banquetReservations.push(reservation);
  return reservation;
}

export async function getBanquetTables(): Promise<BanquetTable[]> {
  return [
    {
      id: '1',
      capacity: 6,
      availableSeats: [
        { reservationId: '', tableId: '1', seatNumber: 1, rationsConsumed: 0 },
        { reservationId: '', tableId: '1', seatNumber: 2, rationsConsumed: 0 },
        { reservationId: '', tableId: '1', seatNumber: 3, rationsConsumed: 0 },
        { reservationId: '', tableId: '1', seatNumber: 4, rationsConsumed: 0 },
        { reservationId: '', tableId: '1', seatNumber: 5, rationsConsumed: 0 },
        { reservationId: '', tableId: '1', seatNumber: 6, rationsConsumed: 0 },
      ],
      occupiants: [],
      state: true,
    },
    {
      id: '2',
      capacity: 6,
      availableSeats: [
        { reservationId: '', tableId: '2', seatNumber: 1, rationsConsumed: 0 },
        { reservationId: '', tableId: '2', seatNumber: 2, rationsConsumed: 0 },
        { reservationId: '', tableId: '2', seatNumber: 3, rationsConsumed: 0 },
        { reservationId: '', tableId: '2', seatNumber: 4, rationsConsumed: 0 },
        { reservationId: '', tableId: '2', seatNumber: 5, rationsConsumed: 0 },
        { reservationId: '', tableId: '2', seatNumber: 6, rationsConsumed: 0 },
      ],
      occupiants: [],
      state: true,
    },
    {
      id: '3',
      capacity: 6,
      availableSeats: [
        { reservationId: '', tableId: '3', seatNumber: 1, rationsConsumed: 0 },
        { reservationId: '', tableId: '3', seatNumber: 2, rationsConsumed: 0 },
        { reservationId: '', tableId: '3', seatNumber: 3, rationsConsumed: 0 },
        { reservationId: '', tableId: '3', seatNumber: 4, rationsConsumed: 0 },
        { reservationId: '', tableId: '3', seatNumber: 5, rationsConsumed: 0 },
        { reservationId: '', tableId: '3', seatNumber: 6, rationsConsumed: 0 },
      ],
      occupiants: [],
      state: true,
    },
    {
      id: '4',
      capacity: 6,
      availableSeats: [
        { reservationId: '', tableId: '4', seatNumber: 1, rationsConsumed: 0 },
        { reservationId: '', tableId: '4', seatNumber: 2, rationsConsumed: 0 },
        { reservationId: '', tableId: '4', seatNumber: 3, rationsConsumed: 0 },
        { reservationId: '', tableId: '4', seatNumber: 4, rationsConsumed: 0 },
        { reservationId: '', tableId: '4', seatNumber: 5, rationsConsumed: 0 },
        { reservationId: '', tableId: '4', seatNumber: 6, rationsConsumed: 0 },
      ],
      occupiants: [],
      state: true,
    },
    {
      id: '5',
      capacity: 6,
      availableSeats: [
        { reservationId: '', tableId: '5', seatNumber: 1, rationsConsumed: 0 },
        { reservationId: '', tableId: '5', seatNumber: 2, rationsConsumed: 0 },
        { reservationId: '', tableId: '5', seatNumber: 3, rationsConsumed: 0 },
        { reservationId: '', tableId: '5', seatNumber: 4, rationsConsumed: 0 },
        { reservationId: '', tableId: '5', seatNumber: 5, rationsConsumed: 0 },
        { reservationId: '', tableId: '5', seatNumber: 6, rationsConsumed: 0 },
      ],
      occupiants: [],
      state: true,
    },
    {
      id: '6',
      capacity: 6,
      availableSeats: [
        { reservationId: '', tableId: '6', seatNumber: 1, rationsConsumed: 0 },
        { reservationId: '', tableId: '6', seatNumber: 2, rationsConsumed: 0 },
        { reservationId: '', tableId: '6', seatNumber: 3, rationsConsumed: 0 },
        { reservationId: '', tableId: '6', seatNumber: 4, rationsConsumed: 0 },
        { reservationId: '', tableId: '6', seatNumber: 5, rationsConsumed: 0 },
        { reservationId: '', tableId: '6', seatNumber: 6, rationsConsumed: 0 },
      ],
      occupiants: [],
      state: true,
    },
  ];
}

/**
 * Function to get all the registered spirits
 */
export async function getAllSpirits(): Promise<Spirit[]> {
  await wait(500);
  const spirits = await Promise.all(
    Array.from({ length: 20 }, (_, i) => getSpirit((i + 1).toString())),
  );
  return spirits.filter((s): s is Spirit => s !== null);
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
  serviceId,
  date,
  timeSlot,
}: {
  serviceId?: string;
  date?: string;
  timeSlot?: string;
}): Promise<Reservation[]> {
  await wait(500);
  return Promise.all(
    Array.from(
      { length: 5 },
      async (_, i) =>
        ({
          id: `res${i + 1}`,
          serviceId: serviceId,
          accountId: `acc1`,
          startTime: new Date(`${date}`),
          endTime: new Date(new Date(`${date}`).getTime() + 60 * 60 * 1000),
          isRedeemed: false,
          isRated: false,
          account: (await getCurrentVenueAcount('venue1')) as VenueAccount,
        }) as Reservation,
    ),
  );
}
