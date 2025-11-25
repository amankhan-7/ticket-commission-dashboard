import { SEAT_STATUS } from "@/constants/seat-selection";

function pushSeatArrangements(seats, seatMap, seatArrangements) {
  seatArrangements.forEach((seatNumbers) => {
    const rowSeats = [];
    seatNumbers.forEach((seatNumber) => {
      const seatData = seatMap.find((seat) => seat.seatNumber === seatNumber);
      if (seatData) {
        rowSeats.push(
          createSeatItem(seatData._id, seatNumber, seatData.status)
        );
      }
    });

    if (rowSeats.length > 0) {
      seats.push(rowSeats);
    }
  });
}

export function generateSeatLayout({ seatMap, totalSeats }) {
  if (!seatMap || !Array.isArray(seatMap)) {
    return [];
  }

  const seats = [];
  if (totalSeats === 17) {
    const seatArrangements = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, 11, 12],
      [13, 14, 15, 16],
    ];
    pushSeatArrangements(seats, seatMap, seatArrangements);
  } else if (totalSeats === 15) {
    // 15-seater: backend seatMap excludes front row seats adjacent to driver
    // So seatMap has 13 seats
    const seatArrangements = [
      [1, 2, 3], // first bus-row
      [4, 5, 6], // second bus-row
      [7, 8, 9], // third bus-row
      [10, 11, 12, 13], // last row
    ];
    pushSeatArrangements(seats, seatMap, seatArrangements);
  } else if (totalSeats === 20) {
    // 20-seater: backend seatMap excludes front row seats adjacent to driver
    // So seatMap has 19 seats
    const seatArrangements = [
      [1, 2, 3], // first bus-row
      [4, 5, 6], // second bus-row
      [7, 8, 9], // third bus-row
      [10, 11, 12], // fourth bus-row
      [13, 14, 15], // fifth bus-row
      [16, 17, 18, 19], // last row
    ];
    pushSeatArrangements(seats, seatMap, seatArrangements);
  } else {
    const seatsPerRow = 4;
    const numberOfRows = Math.ceil(totalSeats / seatsPerRow);

    for (let row = 0; row < numberOfRows; row++) {
      const rowSeats = [];
      const startSeatNumber = row * seatsPerRow + 1;
      const endSeatNumber = Math.min(
        startSeatNumber + seatsPerRow - 1,
        totalSeats
      );

      for (
        let seatNumber = startSeatNumber;
        seatNumber <= endSeatNumber;
        seatNumber++
      ) {
        const seatData = seatMap.find((seat) => seat.seatNumber === seatNumber);
        if (seatData) {
          rowSeats.push(
            createSeatItem(seatData._id, seatNumber, seatData.status)
          );
        }
      }

      if (rowSeats.length > 0) {
        seats.push(rowSeats);
      }
    }
  }

  return seats;
}

function createSeatItem(id, seatNumber, status = "available") {
  return {
    type: "seat",
    id,
    seatNumber,
    status,
  };
}