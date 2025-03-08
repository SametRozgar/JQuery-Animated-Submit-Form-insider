$(document).ready(function() {
       
    $('#applicationDate').datepicker({
        dateFormat: 'dd/mm/yy',
        defaultDate: new Date(),
        changeMonth: true,
        changeYear: true
    }).datepicker('setDate', new Date());

   
    $('#showApplication').click(function(e) {
        e.preventDefault();
        $('#loginBox').hide();
        $('#applicationBox').fadeIn(500);
    });

    $('#showLogin').click(function(e) {
        e.preventDefault();
        $('#applicationBox').fadeOut(500, function() {
            $('#loginBox').fadeIn(500);
        });
    });


    const countryCodes = [
        {name: 'Turkey', code: '+90', pattern: '+90 (5##) ### ## ##'},
        {name: 'USA', code: '+1', pattern: '+1 (###) ###-####'},
        {name: 'Germany', code: '+49', pattern: '+49 (###) #######'},
        {name: 'UK', code: '+44', pattern: '+44 (####) ######'}
    ];

    countryCodes.forEach(country => {
        $('#countryCode').append(
            `<option value="${country.code}" data-pattern="${country.pattern}">${country.name} (${country.code})</option>`
        );
    });

    
    function updatePhoneMask() {
        const selectedCountry = $('#countryCode option:selected');
        const pattern = selectedCountry.data('pattern');
        $('#phone').attr('placeholder', pattern);
        $('#phone').mask(pattern.replace(/#/g, '9'));
    }

    $('#countryCode').change(function() {
        updatePhoneMask();
        $('#phone').val($(this).val()).trigger('input');
    });

    $('#countryCode').val('+90').trigger('change');

   
    $.validator.addMethod("phoneValidation", function(value, element) {
        const countryCode = $('#countryCode').val();
        value = value.replace(/\D/g, '');
        
        if(countryCode === '+90') {
            return value.startsWith('905') && value.length === 12;
        }
        return value.length > 8;
    }, "Please enter a valid phone number");

   
    $('#applicationForm').validate({
        rules: {
            firstName: "required",
            lastName: "required",
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                phoneValidation: true
            },
            position: "required",
            countryCode: "required",
            applicationDate: {
                required: true,
                dateITA: true
            }
        },
        messages: {
            firstName: "Please enter your first name",
            lastName: "Please enter your last name",
            email: {
                required: "Please enter your email",
                email: "Please enter a valid email address"
            },
            phone: {
                required: "Please enter your phone number"
            },
            position: "Please select a position",
            countryCode: "Please select country code",
            applicationDate: {
                required: "Please select application date",
                dateITA: "Please enter a valid date (DD/MM/YYYY)"
            }
        },
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent()).css('color', 'red');
        },
        submitHandler: function(form) {
            $('#successMessage').fadeIn(500);
            setTimeout(function() {
                $('#successMessage').fadeOut(500);
                form.reset();
                $('#applicationBox').fadeOut(500);
                $('#loginBox').fadeIn(500);
                
                $('#applicationDate').datepicker('setDate', new Date());
            }, 3000);
            return false;
        }
    });

    
    $.validator.addMethod("dateITA", function(value, element) {
        return this.optional(element) || /^\d{2}\/\d{2}\/\d{4}$/.test(value);
    }, "Please enter a valid date in the format DD/MM/YYYY");
});