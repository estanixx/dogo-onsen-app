/**
 * Spirit Types - Represents the different categories of spirits
 */
export interface SpiritType {
  id: string;
  name: string;
  dangerScore: number;
}

/**
 * Spirit - Represents a guest entity in the system
 */
export interface Spirit {
  id: string;
  name: string;
  typeId: string;
  type: SpiritType;
  accountId?: string;
  eiltBalance: number;
  individualRecord: string;
  image?: string;
  active?: boolean;
}


/**
 * Venue Account - Represents a spirit's stay/visit at the Dogo Onsen
 */
export interface VenueAccount {
  id: string;
  spiritId: string;
  spirit: Spirit;
  venueId: string;
  startTime: Date;
  endTime: Date;
}

/**
 * Private Venue - Represents a private venue from Dogo Onsen
 */
export interface PrivateVenue {
  id: string;
  state: boolean;
}

/**
 * Service - Represents available services that can be reserved
 */
export interface Service {
  id: string;
  name: string;
  eiltRate: number;
  image: string;
  description: string;
  rating: number;
}

/**
 * Reservation - Represents a booking of a service
 */
export interface Reservation {
  id: string;
  accountId: string;
  startTime: Date;
  endTime: Date;
  seatId?: string;
  serviceId?: string;
  isRedeemed: boolean;
  rating?: number;
}

/**
 * Deposit - Represents EILT currency transactions
 */
export interface Deposit {
  id: string;
  accountId: string;
  amount: number;
  date: Date;
}

/**
 * BanquetTable - Represents individual tables at banquet
 */

export interface BanquetTable {
  id: string;
  capacity: 6;
  availableSeats: BanquetSeat[];
  occupiants: Spirit[];
  state: boolean;
}

/**
 * BanquetSeat - Represents individual seats at banquet tables
 */
export interface BanquetSeat {
  reservationId?: string;
  tableId: string;
  seatNumber: number;
  rationsConsumed: number;
}

/**
 * ConsumptionItem - Represents items consumed during services
 */
export interface ConsumptionItem {
  seatId: string;
  serviceId: string;
  itemId: string;
  quantity: number;
}

/**
 * Item - Represents inventory items used in services
 */
export interface Item {
  id: string;
  name: string;
  image?: string;
}


// Local helper type used by the mock API
// TODO: Modify this (?).
export interface PrivateVenue {
    id: string;
    state: boolean;
}