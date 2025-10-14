import { PrivateVenue, Reservation, Service, Spirit, SpiritType, VenueAccount, BanquetTable, BanquetSeat } from "../types";
import { wait } from "../utils";


/**
 * Function to get available services
 * Returns a list of services with their details
 */
export async function getAvailableServices(query?: string): Promise<Service[]> {
    
    const all: Service[] = [
        {
            eiltRate: 50,
            id: "1",
            name: "Banquete",
            description: "Un banquete donde podrás disfrutar de deliciosos platillos.",
            rating: 4.7,
            image: "https://media.istockphoto.com/id/495329828/es/foto/tostado-casero-del-d%C3%ADa-de-acci%C3%B3n-de-gracias-de-turqu%C3%ADa.jpg?s=612x612&w=0&k=20&c=5JwMBcNXS4lIDWp5a5ojJDEf-f-xraaIIXLQl_Vu2to=",
        },
        {
            eiltRate: 50,
            id: "2",
            name: "Masage relajante",
            description: "Un masaje relajante para relajarse y descansar.",
            rating: 4.8,
            image: "https://media.istockphoto.com/id/1357320952/es/foto/primer-plano-de-un-hombre-recibiendo-masaje.jpg?s=612x612&w=0&k=20&c=CfWa3f91Ylq3u69hezJrOczxSpphtTl1xnHUvNe1pXA=",
        },
        {
            eiltRate: 80,
            id: "3",
            name: "Tratamiento facial",
            description: "Un tratamiento facial rejuvenecedor para tener una piel brillante.",
            rating: 4.6,
            image: "https://leonardmedispa.com/wp-content/uploads/2017/03/facial-86487979-1.jpg",
        },
        {
            eiltRate: 999,
            id: "4",
            name: "Exorcismo",
            description: "Una sesión de exorcismo para una limpieza espiritual.",
            rating: 4.2,
            image: "https://www.sublimehorror.com/wp-content/uploads/2019/03/medieval-representations-of-exorcism-in-art.jpg",
        },
        {
            eiltRate: 2900,
            id: "5",
            name: "Sesión de brujería",
            description: "Una sesión mística de brujería para necesidades especiales.",
            rating: 4.9,
            image: "https://media.cnn.com/api/v1/images/stellar/prod/211030185915-05-witchcraft-taschen-witch-symbolism-art.jpg?q=w_1110,c_fill",
        },
    ];

    if (!query) {return all;}

    const q = query.toLowerCase().trim();
    return all.filter((s) => s.name.toLowerCase().includes(q));
}

export async function getAvailablePrivateVenues(startTime: Date, endTime: Date): Promise<PrivateVenue[]> {
    return [
        {
            id: "1",
            state: true,
        },
        {
            id: "2",
            state: true,
        },
        {
            id: "3",
            state: true,
        },
        {
            id: "4",
            state: false,
        },
        {
            id: "5",
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
        id: "1",
        spiritId: "007",
        spirit: await getSpirit("007") as Spirit,
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
        name: "Agente " + spiritId,
        typeId: "1",
        type: await getSpiritType("1") as SpiritType,
        accountId: "1",
        eiltBalance: 200,
        individualRecord: new Date().toISOString(),
        image: "https://static.wikia.nocookie.net/hitman/images/e/ec/Agent_47_in_Hitman_2016.png/revision/latest/scale-to-width/360?cb=20230124042322",
    };
}


/**
 * Function to get spirit type details by ID
 */
export async function getSpiritType(typeId: string): Promise<SpiritType | null> {
    return {
        id: typeId,
        name: "Agente Secreto",
        dangerScore: 90,
    };
}

export async function getAllSpiritTypes(): Promise<SpiritType[]> {
    return [
        {
            id: "1",
            name: "Agente Secreto",
            dangerScore: 90,
        },
        {
            id: "2",
            name: "Fantasma amigable",
            dangerScore: 10,
        },
        {
            id: "3",
            name: "Espíritu travieso",
            dangerScore: 50,
        },
        {
            id: "4",
            name: "Alma en pena",
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
    return ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
}

/**
 * Function to book a service for a venue account at a specific date and time
 */
export async function bookService(serviceId: string, accountId: string, date: Date, time: string): Promise<Reservation> {
    // Simulate booking a service
    await wait(500);
    return {
        id: "1",
        serviceId,
        accountId,
        startTime: date,
        endTime: new Date(date.getTime() + 60 * 60 * 1000), // 1 hour later
        isRedeemed: false,
    };
}

export async function createSpirit(id:string, name: string, typeId: string, image?: string): Promise<Spirit> {
    // Simulate creating a new spirit
    await wait(500);
    return {
        id,
        name,
        typeId,
        type: await getSpiritType(typeId) as SpiritType,
        eiltBalance: 0,
        individualRecord: new Date().toISOString(),
        image,
    };
}

export async function getBanquetTables(): Promise<BanquetTable[]> {
    return [
        {
            id: "1",
            capacity: 6,
            availableSeats: [
                { reservationId: "2", tableId: "1", seatNumber: "1", rationsConsumed: 0 },
                { reservationId: "", tableId: "1", seatNumber: "2", rationsConsumed: 0 },
                { reservationId: "", tableId: "1", seatNumber: "3", rationsConsumed: 0 },
                { reservationId: "", tableId: "1", seatNumber: "4", rationsConsumed: 0 },
                { reservationId: "", tableId: "1", seatNumber: "5", rationsConsumed: 0 },
                { reservationId: "", tableId: "1", seatNumber: "6", rationsConsumed: 0 },
            ],
            occupiants: [],
            state: true,
        },
        {
            id: "2",
            capacity: 6,
            availableSeats: [
                { reservationId: "", tableId: "2", seatNumber: "1", rationsConsumed: 0 },
                { reservationId: "", tableId: "2", seatNumber: "2", rationsConsumed: 0 },
                { reservationId: "", tableId: "2", seatNumber: "3", rationsConsumed: 0 },
                { reservationId: "", tableId: "2", seatNumber: "4", rationsConsumed: 0 },
                { reservationId: "", tableId: "2", seatNumber: "5", rationsConsumed: 0 },
                { reservationId: "", tableId: "2", seatNumber: "6", rationsConsumed: 0 },
            ],
            occupiants: [],
            state: true,
        },
        {
            id: "3",
            capacity: 6,
            availableSeats: [
                { reservationId: "", tableId: "3", seatNumber: "1", rationsConsumed: 0 },
                { reservationId: "", tableId: "3", seatNumber: "2", rationsConsumed: 0 },
                { reservationId: "", tableId: "3", seatNumber: "3", rationsConsumed: 0 },
                { reservationId: "", tableId: "3", seatNumber: "4", rationsConsumed: 0 },
                { reservationId: "", tableId: "3", seatNumber: "5", rationsConsumed: 0 },
                { reservationId: "", tableId: "3", seatNumber: "6", rationsConsumed: 0 },
            ],
            occupiants: [],
            state: true,
        },
        {
            id: "4",
            capacity: 6,
            availableSeats: [
                { reservationId: "", tableId: "4", seatNumber: "1", rationsConsumed: 0 },
                { reservationId: "", tableId: "4", seatNumber: "2", rationsConsumed: 0 },
                { reservationId: "", tableId: "4", seatNumber: "3", rationsConsumed: 0 },
                { reservationId: "", tableId: "4", seatNumber: "4", rationsConsumed: 0 },
                { reservationId: "", tableId: "4", seatNumber: "5", rationsConsumed: 0 },
                { reservationId: "", tableId: "4", seatNumber: "6", rationsConsumed: 0 },
            ],
            occupiants: [],
            state: true,
        },
        {
            id: "5",
            capacity: 6,
            availableSeats: [
                { reservationId: "", tableId: "5", seatNumber: "1", rationsConsumed: 0 },
                { reservationId: "", tableId: "5", seatNumber: "2", rationsConsumed: 0 },
                { reservationId: "", tableId: "5", seatNumber: "3", rationsConsumed: 0 },
                { reservationId: "", tableId: "5", seatNumber: "4", rationsConsumed: 0 },
                { reservationId: "", tableId: "5", seatNumber: "5", rationsConsumed: 0 },
                { reservationId: "", tableId: "5", seatNumber: "6", rationsConsumed: 0 },
            ],
            occupiants: [],
            state: true,
        },
        {
            id: "6",
            capacity: 6,
            availableSeats: [
                { reservationId: "", tableId: "6", seatNumber: "1", rationsConsumed: 0 },
                { reservationId: "", tableId: "6", seatNumber: "2", rationsConsumed: 0 },
                { reservationId: "", tableId: "6", seatNumber: "3", rationsConsumed: 0 },
                { reservationId: "", tableId: "6", seatNumber: "4", rationsConsumed: 0 },
                { reservationId: "", tableId: "6", seatNumber: "5", rationsConsumed: 0 },
                { reservationId: "", tableId: "6", seatNumber: "6", rationsConsumed: 0 },
            ],
            occupiants: [],
            state: true,
        }
    ]
}


/**
 * Function to get all the registered spirits
 */
export async function getAllSpirits(): Promise<Spirit[]> {
    await wait(500);
    const spirits = await Promise.all(Array.from({ length: 20 }, (_, i) => getSpirit((i + 1).toString())));
    return spirits.filter((s): s is Spirit => s !== null);
}