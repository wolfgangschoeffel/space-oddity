/* map one range to another */
function mapRange(input, in_min , in_max , out_min , out_max ) {
    return ( input - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}