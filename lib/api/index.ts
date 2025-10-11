import { PrivateVenue, Service, Spirit, SpiritType, VenueAccount } from "../types";
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
            name: "Masage relajante",
            description: "Un masaje relajante para relajarse y descansar.",
            rating: 4.8,
            image: "https://media.istockphoto.com/id/1357320952/es/foto/primer-plano-de-un-hombre-recibiendo-masaje.jpg?s=612x612&w=0&k=20&c=CfWa3f91Ylq3u69hezJrOczxSpphtTl1xnHUvNe1pXA=",
        },
        {
            eiltRate: 80,
            id: "2",
            name: "Tratamiento facial",
            description: "Un tratamiento facial rejuvenecedor para tener una piel brillante.",
            rating: 4.6,
            image: "https://leonardmedispa.com/wp-content/uploads/2017/03/facial-86487979-1.jpg",
        },
        {
            eiltRate: 999,
            id: "3",
            name: "Exorcismo",
            description: "Una sesión de exorcismo para una limpieza espiritual.",
            rating: 4.2,
            image: "https://www.sublimehorror.com/wp-content/uploads/2019/03/medieval-representations-of-exorcism-in-art.jpg",
        },
        {
            eiltRate: 2900,
            id: "4",
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

export async function getAvailablePrivateVenues(): Promise<PrivateVenue[]> {
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
        name: "Agente 47",
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

export async function getAvailableTimeSlots(serviceId: string, date: Date): Promise<string[]> {
    // Simulate fetching from server
    await wait(500);
    return ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
}

