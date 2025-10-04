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
  accountId?: string;
  eiltBalance: number;
  individualRecord: string;
  image?: string;
}

/**
 * Venue Account - Represents a spirit's stay/visit at the Dogo Onsen
 */
export interface VenueAccount {
  id: string;
  spiritId: string;
  venueId: string;
  startTime: Date;
  endTime: Date;
}

/**
 * Service - Represents available services that can be reserved
 */
export interface Service {
  id: string;
  name: string;
  eiltRate: number;
  image?: string;
}

/**
 * Reservation - Represents a booking of a service
 */
export interface Reservation {
  id: string;
  accountId: string;
  startTime: Date;
  endTime: Date;
  seatId: string;
  serviceId: string;
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
 * BanquetSeat - Represents individual seats at banquet tables
 */
export interface BanquetSeat {
  tableId: string;
  seatNumber: number;
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
