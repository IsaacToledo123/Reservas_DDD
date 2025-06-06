export class Reservation {
  constructor(
    public id: string,
    public userId: string,
    public roomId: string,
    public startDate: Date,
    public endDate: Date,
    public status: 'pending' | 'confirmed' | 'cancelled'
  ) {}

  confirm() {
    if (this.status === 'pending') {
      this.status = 'confirmed';
    } else {
      throw new Error('Reservation can only be confirmed if it is pending.');
    }
  }

    cancel() {
        if (this.status === 'pending' || this.status === 'confirmed') {
        this.status = 'cancelled';
        } else {
        throw new Error('Reservation can only be cancelled if it is pending or confirmed.');
        }
    }
    
}