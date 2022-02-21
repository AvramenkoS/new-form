const form = `<h2  name="title">Новая форма</h2>
  <input data-validation_type="firstname" name="firstname" placeholder="Введите имя" required="" />
  <input data-validation_type="lastname" placeholder="Введите фамилию" name="lastname" value="" required="" />
  <input type="email" data-validation_type="email" name="email" placeholder="Введите электронный адрес"required="" />
  <input data-validation_type="phone" type="tel" class="phone" name="phone" required autocomplete="off" />
  <button name="button" class="send-form btn btn-primary" data-validation_type="submit" type="submit" disabled>
</button>
<div class="form_input--hidden">
  <input type="hidden" name="full-phone" />
  <input type="hidden" name="aff_id" value="" />
  <input type="hidden" name="aff_id2" value="" />
  <input type="hidden" name="aff_c" value="" />
  <input type="hidden" name="country" />
  <input type="hidden" name="full-country" />
  <input type="hidden" name="offer" value="form" />
  <input type="hidden" name="lang" value="UA" />
  <input type="hidden" name="ip" value="" />
  <input type="hidden" name="domain" value="" />
  <input type="hidden" name="prefix" />
  <input type="hidden" name="clickid" value="" />
  <input type="hidden" name="sub_id_3" value="" />
  <input type="hidden" name="sub_id_4" value="" />
  <input type="hidden" name="sub_id_5" value="" />
  <input type="hidden" name="sub_id_6" value="" />
  <input type="hidden" name="sub_id_7" value="" />
  <input type="hidden" name="sub_id_8" value="" />
  <input type="hidden" name="sub_id_9" value="" />
</div>`;

export default form;
