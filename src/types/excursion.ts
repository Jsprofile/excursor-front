export interface TicketType {
  id: string;
  type: 'adult' | 'child';
  price: string;
}

export interface Excursion {
  id: string;
  title: string;
  description: string | null;
  location: string;
  departureAt: string;
  totalSlots: number;
  status: string;
  company: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  ticketTypes: TicketType[];
}