import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.querySelector('.form').addEventListener('submit', event => {
  event.preventDefault();

  const form = event.target;
  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  if (!state) {
    iziToast.error({
      title: 'Error',
      message: 'Please select a state (fulfilled or rejected)',
      position: 'topRight',
    });
    return;
  }

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      state === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  });

  promise
    .then(delay => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
        timeout: 5000,
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
        timeout: 5000,
      });
    });

  form.reset();
});
