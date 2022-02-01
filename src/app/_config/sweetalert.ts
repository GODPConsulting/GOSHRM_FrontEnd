import Swal from 'sweetalert2';

export const SwalConfig = Swal.mixin({
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Continue',
    reverseButtons: true,
    allowOutsideClick: false
})

export const SwalConfig2 = Swal.mixin({
    showCancelButton: false,
    confirmButtonText: 'Continue',
    allowOutsideClick: false
})

export const SwalConfirmation = Swal.mixin({
    showCancelButton: false,
    confirmButtonText: 'Close',
    allowOutsideClick: false
})