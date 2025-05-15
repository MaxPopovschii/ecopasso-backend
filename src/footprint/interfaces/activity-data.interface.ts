export interface ActivityData {
  type: 'transport' | 'energy' | 'waste' | 'food';
  subtype: string;
  data: {
    distance?: number;    // for transport
    amount?: number;      // for energy and food
    weight?: number;      // for waste
    [key: string]: any;  // for additional data
  };
}