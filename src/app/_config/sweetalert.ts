import Swal from 'sweetalert2';

export const SwalConfig = Swal.mixin({
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Continue',
    reverseButtons: true,
    allowOutsideClick: false,
    width: '500px',
    confirmButtonColor: '#F88F09',
})

export const SwalConfig2 = Swal.mixin({
    showCancelButton: false,
    confirmButtonText: 'Done',
    allowOutsideClick: false,
    width: '500px',
    confirmButtonColor: '#F88F09',
})

export const SwalConfirmation = Swal.mixin({
    showCancelButton: false,
    confirmButtonText: 'Close',
    allowOutsideClick: false,
    width: '500px',
    confirmButtonColor: '#F88F09',
})