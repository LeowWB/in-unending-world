"use strict"
"hide source"
"sensitive"

const TEN_X_SUMMON = 10
const SINGLE_SUMMON = 1

function update() {
    var normal_tix = document.getElementById('normal_tix').value
    var ten_x_tix = document.getElementById('ten_x_tix').value

    var all_orders = get_all_orders(normal_tix, ten_x_tix)

    var best_order = null
    var best_five_count = 0

    all_orders.forEach((order) => {
        var total_five_count = 0
        for (var i = 0; i < 1000; i++) {
            total_five_count += simulate_summon_sequence(order)
        }

        if (total_five_count > best_five_count) {
            best_five_count = total_five_count
            best_order = order
        }
    })

    write_output(JSON.stringify(best_order) + '\n' + best_five_count/1000)
}


function simulate_summon_sequence(order) {
    var five_rate = 0.06
    var five_count = 0
    var since_last_five = 0

    order.forEach((next_summon) => {
        if (next_summon == SINGLE_SUMMON) {
            if (Math.random() < five_rate) {
                five_rate = 0.06
                five_count++
                since_last_five = 0
            } else {
                since_last_five++
                if (since_last_five == 10) {
                    five_rate += 0.005
                    since_last_five = 0
                    if (five_rate == 0.1) {
                        five_rate = 1
                    }
                }
            }
        } else {
            var got_a_five_in_this_10x = false
            for (var i = 0; i < 10; i++) {
                if (Math.random() < five_rate) {
                    got_a_five_in_this_10x = true
                    five_count++
                    since_last_five = 0
                } else {
                    since_last_five++
                }
            }
            if (!got_a_five_in_this_10x) {
                if (since_last_five >= 10) {
                    since_last_five -= 10
                    five_rate += 0.005
                    if (five_rate == 0.1) {
                        five_rate = 1
                    }
                }
            }
        }
    })

    return five_count
}


function get_all_orders(normal_tix, ten_x_tix) {
    if (ten_x_tix == 0) {
        var order = []
        for (var i = 0; i < normal_tix; i++) {
            order.push(SINGLE_SUMMON)
        }
        return [order]
    }

    if (normal_tix == 0) {
        var order = []
        for (var i = 0; i < ten_x_tix; i++) {
            order.push(TEN_X_SUMMON)
        }
        return [order]
    }

    var orders_if_summon_ten = get_all_orders(normal_tix, ten_x_tix-1)
    orders_if_summon_ten.forEach(arr => arr.unshift(TEN_X_SUMMON))
    var orders_if_summon_one = get_all_orders(normal_tix-1, ten_x_tix)
    orders_if_summon_one.forEach(arr => arr.unshift(SINGLE_SUMMON))

    return orders_if_summon_one.concat(orders_if_summon_ten)
}

function write_output(text) {
    document.getElementById('output').innerHTML = text
}