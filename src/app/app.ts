import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

interface Service {
  icon: string;
  title: string;
  description: string;
  img: string;
}

interface Doctor {
  name: string;
  role: string;
  experience: string;
  bio: string;
  image: string;
}

interface Review {
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CarouselSlide {
  image: string;
  alt: string;
  title: string;
  thought: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  clinicName = signal('Ekdantaay Dental Clinic');
  private readonly clinicEmail = signal('sutarerns@gmail.com'); // Doctor / Clinic Inbox
  // EmailJS Configuration Keys
  private readonly EMAILJS_SERVICE_ID = 'service_phyu8ne';
  private readonly EMAILJS_CLINIC_TEMPLATE_ID = 'template_7y7ihyo';
  private readonly EMAILJS_PATIENT_TEMPLATE_ID = 'template_c7dz06j';
  private readonly EMAILJS_PUBLIC_KEY = 'Sfv1F-Y1aQQgMkurN';

  // Mobile Navigation Drawer Signal
  isMobileMenuOpen = signal(false);

  // Modal & Async Loading Signals
  isModalOpen = signal(false);
  bookingSuccess = signal(false);
  isSending = signal(false);

  // Form Fields State
  selectedService = signal('');
  selectedDoctor = signal('');
  bookingDate = signal('');
  selectedTimeSlot = signal('');
  patientName = signal('');
  patientEmail = signal('');
  patientPhone = signal('');

  // Available Time Slots
  availableTimeSlots = signal<string[]>([
    '10:00 AM To 01:00 PM', '01:30 PM To 05:30 PM', '06:00 PM To 9:00 PM'
  ]);

  // Dynamic Minimum Date (Prevents past date selection)
  minDate = computed(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Services Data
  services = signal<Service[]>([
    { icon: '🦷', title: 'General Dentistry', description: 'Comprehensive oral exams, routine cleanings, fillings, and preventive dental care.', img: 'general.jpg' },
    { icon: '✨', title: 'Teeth Whitening', description: 'Professional in-office laser whitening treatments for a radiant, brighter smile in one visit.', img: 'tooth-whitening.jpg' },
    { icon: '😁', title: 'Orthodontics & Braces', description: 'Clear aligners (Invisalign) and traditional braces designed to straighten misaligned teeth.', img: 'braces1.jpg' },
    { icon: '🛡️', title: 'Dental Implants', description: 'Permanent, natural-looking tooth replacements engineered for optimal function and durability.', img: 'implant.jpg' },
    { icon: '🔬', title: 'Root Canal Therapy', description: 'Gentle, pain-free endodontic procedures to save infected teeth and eliminate pain.', img: 'root-canal.jpg' },
    { icon: '💎', title: 'Cosmetic Dentistry', description: 'Porcelain veneers, composite bonding, and full smile makeovers tailored to your goals.', img: 'cosmetic.jpg' }
  ]);
  // Doctors Data 
  doctors = signal<Doctor[]>([
    {
      name: 'Dr. Jonas kebby, BDS',
      role: 'Lead Prosthodontist & Cosmetic Dentist',
      experience: '1000+ Patient Handling Experience',
      bio: 'Specializes in aesthetic restorations and full-mouth rehabilitation with a gentle touch.',
      // image: 'pooja.jpg'
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZG9jdG9yfGVufDB8fDB8fHww'
    }
  ]);

  // Reviews Data
  reviews = signal<Review[]>([
    { patientName: 'Gaikwad B.A.', rating: 5, comment: 'The best dental experience I have ever had! The staff made me feel completely relaxed.', date: '2 weeks ago' },
    { patientName: 'Rahul G', rating: 5, comment: 'Dr. Jonas fixed my implant flawlessly. Clean, modern, and high-tech facility.', date: '1 month ago' },
    { patientName: 'Chavan C.B', rating: 5, comment: 'Brought my kids here for a routine check-up. Super friendly team and zero wait time!', date: '3 weeks ago' }
  ]);

  slides: CarouselSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1734518352260-acb18b3f1e9c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQwfHxvcnRob2RvbnRpY3N8ZW58MHx8MHx8fDA%3D',
      alt: 'Modern Clinic Reception',
      title: 'Your Radiant Smile Starts with Expert Care',
      thought: '"Healing begins with trust, compassion, and dedicated patient care."'
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1673728788984-6d6540186c95?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg1fHxvcnRob2RvbnRpY3N8ZW58MHx8MHx8fDA%3D',
      alt: 'Advanced Medical Technology',
      title: 'Advanced Care & Technology',
      thought: '"Combining state-of-the-art medical innovations with a soft human touch."'
    },
    {
      image: 'https://images.unsplash.com/photo-1777443726993-8f9c8e96e46e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTcxfHxvcnRob2RvbnRpY3N8ZW58MHx8MHx8fDA%3D',
      alt: 'Compassionate Doctors',
      title: 'Expert Guidance You Can Trust',
      thought: '"Every consultation is a partnership toward your long-term wellness."'
    },
    {
      image: 'https://images.unsplash.com/photo-1656428964836-78d54bf76231?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzU4fHxvcnRob2RvbnRpY3N8ZW58MHx8MHx8fDA%3D',
      alt: 'Comfortable Clinic Environment',
      title: 'A Place of Hope & Recovery',
      thought: '"We design our environment so every patient feels comfortable, safe, and heard."'
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1702598812685-0d7675d8f0fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzM3fHxvcnRob2RvbnRpY3N8ZW58MHx8MHx8fDA%3D',
      alt: 'Preventative Healthcare',
      title: 'Preventative Health Matters',
      thought: '"Small healthy choices today build a stronger, brighter tomorrow."'
    }
  ];

  currentIndex = 0;
  private readonly autoSlideInterval = 5000; // 5 seconds
  private timerId: any = null;
  private touchStartX = 0;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  async confirmBooking(): Promise<void> {
    if (
      !this.bookingDate() ||
      !this.selectedTimeSlot() ||
      !this.patientName() ||
      !this.patientEmail() ||
      !this.patientPhone()
    ) {
      alert('Please fill out all required fields and select a time slot.');
      return;
    }

    this.isSending.set(true);


    // Payload sent to EmailJS templates
    const templateParams = {
      clinic_email: this.clinicEmail(),
      patient_name: this.patientName(),
      patient_email: this.patientEmail(),
      patient_phone: this.patientPhone(),
      selected_service: this.selectedService() || 'General Consultation',
      selected_doctor: this.selectedDoctor() || 'Any Available Specialist',
      booking_date: this.bookingDate(),
      booking_time: this.selectedTimeSlot()
    };

    try {
      // 1. Send primary notification to Clinic/Doctor FIRST
      await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_CLINIC_TEMPLATE_ID,
        templateParams,
        this.EMAILJS_PUBLIC_KEY
      );

      // 2. Send confirmation copy to Patient SECOND
      await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_PATIENT_TEMPLATE_ID,
        templateParams,
        this.EMAILJS_PUBLIC_KEY
      );

      this.bookingSuccess.set(true);
    } catch (error) {
      console.error('EmailJS Dual Dispatch Failed:', error);
      alert('There was an issue dispatching the booking notification. Please try again or call our reception.');
    } finally {
      this.isSending.set(false);
    }
  }



  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  scrollToSection(sectionId: string): void {
    this.closeMobileMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Modal Handlers
  openBookingModal(serviceTitle?: string, doctorName?: string): void {
    this.closeMobileMenu();
    if (serviceTitle) this.selectedService.set(serviceTitle);
    if (doctorName) this.selectedDoctor.set(doctorName);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    setTimeout(() => this.resetBookingForm(), 300);
  }

  selectSlot(slot: string): void {
    this.selectedTimeSlot.set(slot);
  }

  resetBookingForm(): void {
    this.bookingSuccess.set(false);
    this.selectedService.set('');
    this.selectedDoctor.set('');
    this.bookingDate.set('');
    this.selectedTimeSlot.set('');
    this.patientName.set('');
    this.patientEmail.set('');
    this.patientPhone.set('');
  }


  //carasoul
  startAutoSlide(): void {
    if (!this.timerId) {
      this.timerId = setInterval(() => {
        this.nextSlide();
      }, this.autoSlideInterval);
    }
  }

  stopAutoSlide(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  resetAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoSlide();
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  onManualNext(): void {
    this.nextSlide();
    this.resetAutoSlide();
  }

  onManualPrev(): void {
    this.prevSlide();
    this.resetAutoSlide();
  }

  // Mobile Touch/Swipe Handlers
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].clientX;
    const diff = this.touchStartX - touchEndX;

    if (diff > 50) {
      this.onManualNext();
    } else if (diff < -50) {
      this.onManualPrev();
    }
  }


  ngOnDestroy(): void {
    this.stopAutoSlide();
  }
}
