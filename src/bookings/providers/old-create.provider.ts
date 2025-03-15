// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { CreateBookingDto } from '../dtos/create-draft-booking.dto';
// import { UUID } from 'crypto';
// import { Between, DataSource, Repository } from 'typeorm';
// import { Booking } from '../booking.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { PeopleService } from 'src/people/people.service';
// import { Field } from 'src/fields/field.entity';
// import { isBefore } from 'src/utils/isBefore';
// import { Voucher } from 'src/vouchers/voucher.entity';
// import { BookingService } from '../booking-service.entity';
// import { Service } from 'src/services/service.entiry';
// import { duration } from 'src/utils/duration';
// import { durationOverlapTime } from 'src/utils/duration-overlap-time';
// import { VoucherTypeEnum } from 'src/vouchers/enums/voucher-type.enum';
// import { isBetweenTime } from 'src/utils/is-between-time';

// @Injectable()
// export class OldCreateProvider {
//   constructor(
//     /**
//      * injet booking repository
//      */
//     @InjectRepository(Booking)
//     private readonly bookingRepository: Repository<Booking>,
//     /**
//      * inject people service
//      */
//     private readonly peopleService: PeopleService,
//     /**
//      * inject data source
//      */
//     private readonly dataSource: DataSource,
//   ) {}

//   public async create(createBookingDto: CreateBookingDto, playerId: UUID) {
//     if (!isBefore(createBookingDto.startTime, createBookingDto.endTime)) {
//       throw new BadRequestException('startTime must before endTime');
//     }

//     const player = await this.peopleService.getById(playerId);

//     const queryRunner = this.dataSource.createQueryRunner();

//     await queryRunner.connect();

//     await queryRunner.startTransaction();

//     try {
//       // get field
//       const field = await queryRunner.manager.findOne(Field, {
//         where: {
//           id: createBookingDto.fieldId,
//         },
//         relations: {
//           fieldGroup: {
//             facility: true,
//           },
//         },
//       });

//       if (!field) {
//         throw new Error('Field not found');
//       }

//       const fieldGroup = field.fieldGroup;

//       const playTime = duration(
//         createBookingDto.endTime,
//         createBookingDto.startTime,
//       );

//       const price = playTime * fieldGroup.basePrice;

//       let pricePeak = 0;

//       if (
//         fieldGroup.peakEndTime &&
//         fieldGroup.peakStartTime &&
//         fieldGroup.priceIncrease
//       ) {
//         const overlapPeak = durationOverlapTime(
//           fieldGroup.peakStartTime,
//           fieldGroup.peakStartTime,
//           createBookingDto.startTime,
//           createBookingDto.endTime,
//         );

//         pricePeak = overlapPeak * fieldGroup.priceIncrease;
//       }

//       const facility = fieldGroup.facility;

//       // check startTime and endTime between openTime and closeTime
//       if (
//         !isBetweenTime(
//           createBookingDto.startTime,
//           createBookingDto.endTime,
//           facility.openTime,
//           facility.closeTime,
//         )
//       ) {
//         throw new BadRequestException(
//           'Booking time must between openTime and closeTime',
//         );
//       }

//       // check not overlap with other booking
//       const bookings = await queryRunner.manager.find(Booking, {
//         where: [
//           {
//             field: {
//               id: createBookingDto.fieldId,
//             },
//             date: createBookingDto.date,
//             startTime: Between(
//               createBookingDto.startTime,
//               createBookingDto.endTime,
//             ),
//           },
//           {
//             field: {
//               id: createBookingDto.fieldId,
//             },
//             date: createBookingDto.date,
//             endTime: Between(
//               createBookingDto.startTime,
//               createBookingDto.endTime,
//             ),
//           },
//         ],
//       });

//       if (bookings.length > 0) {
//         throw new BadRequestException(
//           'Booking time must not overlap with other booking',
//         );
//       }

//       let finalPrice = price + pricePeak;

//       // create booking
//       const booking = queryRunner.manager.create(Booking, {
//         ...createBookingDto,
//         price,
//         pricePeak,
//         finalPrice,
//         field,
//         player,
//       });

//       await queryRunner.manager.save(booking);

//       // check not overlap with other service and save it
//       if (createBookingDto.bookingServicesData) {
//         for (const bookingService of createBookingDto.bookingServicesData) {
//           // get service
//           const service = await queryRunner.manager.findOne(Service, {
//             where: {
//               id: bookingService.serviceId,
//             },
//             relations: {
//               facility: true,
//             },
//           });
//           // check service exist
//           if (!service) {
//             throw new NotFoundException(
//               `Service id(${bookingService.serviceId}) not found`,
//             );
//           }

//           // check service and field in same facility
//           if (service.facility.id !== facility.id) {
//             throw new BadRequestException(
//               `Service ${service.id} and field ${field.id} not same facility`,
//             );
//           }

//           // check not overlap with other booking
//           const othersBookingService = await queryRunner.manager.find(
//             BookingService,
//             {
//               where: [
//                 {
//                   service: {
//                     id: bookingService.serviceId,
//                   },
//                   booking: {
//                     date: createBookingDto.date,
//                     startTime: Between(
//                       createBookingDto.startTime,
//                       createBookingDto.endTime,
//                     ),
//                   },
//                 },
//                 {
//                   service: {
//                     id: bookingService.serviceId,
//                   },
//                   booking: {
//                     date: createBookingDto.date,
//                     endTime: Between(
//                       createBookingDto.startTime,
//                       createBookingDto.endTime,
//                     ),
//                   },
//                 },
//               ],
//             },
//           );

//           // check service not out of stock
//           const amountOfServiceRented = othersBookingService.reduce(
//             (prev, curr) => prev + curr.quantity,
//             0,
//           );

//           if (amountOfServiceRented + bookingService.amount > service.amount) {
//             throw new BadRequestException(
//               `service ${bookingService.serviceId} is  out of stock`,
//             );
//           }

//           finalPrice += service.price * bookingService.amount;
//           // create booking service
//           const newBookingService = queryRunner.manager.create(BookingService, {
//             booking,
//             service,
//             quantity: bookingService.amount,
//           });
//           // save

//           await queryRunner.manager.save(newBookingService);
//         }
//       }

//       // check not remain voucher
//       let voucher: Voucher | null = null;
//       const today = new Date();

//       if (createBookingDto.voucherId) {
//         voucher = await queryRunner.manager.findOne(Voucher, {
//           where: {
//             id: createBookingDto.voucherId,
//           },
//         });

//         if (!voucher) {
//           throw new NotFoundException('Voucher not found');
//         }

//         if (voucher.startTime.valueOf() >= today.valueOf()) {
//           throw new BadRequestException(
//             'Voucher activation time has not come yet',
//           );
//         }

//         if (voucher.endTime.valueOf() <= today.valueOf()) {
//           throw new BadRequestException('Voucher is expire');
//         }

//         if (voucher.remain <= 0) {
//           throw new BadRequestException('Voucher out of stock');
//         }

//         if (voucher.minPrice < finalPrice) {
//           voucher.remain -= 1;

//           let discount = 0;

//           if (voucher.voucherType === VoucherTypeEnum.CASH) {
//             discount = voucher.value;
//           } else {
//             discount = (finalPrice * voucher.value) / 100;
//           }

//           if (discount > voucher.maxDiscount) {
//             discount = voucher.maxDiscount;
//           }

//           finalPrice -= discount;
//         }
//         await queryRunner.manager.save(voucher);
//       }

//       booking.finalPrice = finalPrice;
//       booking.voucher = voucher ?? undefined;

//       await queryRunner.manager.save(booking);

//       await queryRunner.commitTransaction();
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       throw new BadRequestException('Create booking failed', {
//         description: String(error),
//       });
//     } finally {
//       await queryRunner.release();
//     }

//     return { message: 'create booking successfully' };
//   }
// }
