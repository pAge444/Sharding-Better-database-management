const express = require('express');

exports.register = (email,req,res) => {
    console.log(email[0]);
    const str = email[0];
    const af = /[a-f]/gi;
    const gl = /[g-l]/gi;
    const mr = /[m-r]/gi;
    const sx = /[s-x]/gi;
    const yz = /[yz0123]/gi;
    const n = /[4-9]/g;

    if(str.match(af) != null){ //for a to f 
        console.log('table_a_to_f');
        return ('table_a_to_f');
    }
    else if(str.match(gl) != null){ //for g to l
        console.log('table_g_to_l');
        return ('table_g_to_l');
    }
    else if(str.match(mr) != null){ //for m to r
        console.log('table_m_to_r');
        return ('table_m_to_r');
    }
    else if(str.match(sx) != null){ // for s to x
        console.log('table_s_to_x');
        return ('table_s_to_x');
    }
    else if(str.match(yz) != null){ // for y,z,0,1,2,3
        console.log('table_y_z_0_to_3');
        return ('table_y_z_0_to_3');
    }
    else if(str.match(n) != null){ //for 4 to 9
        console.log('table_4_to_9');
        return ('table_4_to_9');
    }
    else{
        console.log('table_default');
        return ('table_default');
    }
}