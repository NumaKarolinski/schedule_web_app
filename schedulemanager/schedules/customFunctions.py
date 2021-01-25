import math as m
import numpy as np
import random as r


def cpdf(sigmas_from_bound):
    return 0.5 * (1 + m.erf(sigmas_from_bound / m.sqrt(2)))


def generate_gaussian(nn_n_1, nn_n_2, n, n_more, n_less, available):

    if nn_n_1:
        if n == n_less:
            lower_bound = n_less
        else:
            lower_bound = 0
    else:
        lower_bound = n_less

    if nn_n_2:
        if n == n_more:
            upper_bound = n_more
        else:
            upper_bound = available
    else:
        if available < n_more:
            upper_bound = available
        else:
            upper_bound = n_more

    # both values are in minutes, they are the upper and lower sigma
    # for the piecewise Gaussian (left and right half of Gaussian)
    # lower_sigma_in_minutes is negative because it's less than the mean
    # n_less and n_more are -2*sigma_lower and 2*sigma_upper,
    # respectively, so l_b_s_f_m <= 0, and u_b_s_f_m >= 0
    lower_sigma_in_minutes = (n_less - n) / 2
    upper_sigma_in_minutes = (n_more - n) / 2

    if lower_bound == n and upper_bound == n:
        return n

    elif upper_bound == n:
        upper_bound_sigmas_from_mean = 0
        lower_bound_sigmas_from_mean = (
            n - lower_bound) / lower_sigma_in_minutes
        threshold = 1
        fl = 1
        fm = 0

    elif lower_bound == n:
        upper_bound_sigmas_from_mean = (
            upper_bound - n) / upper_sigma_in_minutes
        lower_bound_sigmas_from_mean = 0
        threshold = 1
        fl = 0
        fm = 1

    else:
        lower_bound_sigmas_from_mean = (
            n - lower_bound) / lower_sigma_in_minutes
        upper_bound_sigmas_from_mean = (
            upper_bound - n) / upper_sigma_in_minutes

        fl = 0.5 - cpdf(lower_bound_sigmas_from_mean)
        fm = cpdf(upper_bound_sigmas_from_mean) - 0.5

        if (-1 * lower_bound_sigmas_from_mean) <= upper_bound_sigmas_from_mean:
            threshold = fl / fm
        else:
            threshold = fm / fl

    valid_value = False

    while not valid_value:

        ro = r.random()
        roo = r.random()
        rooo = r.random()

        if (roo < 0.25) or (roo >= 0.75):
            if upper_bound == n:
                pass
            else:
                if (fm > fl and rooo <= threshold) or (fm <= fl):

                    x_m = upper_sigma_in_minutes * \
                        np.sqrt(2 * (-np.log(1 - ro))) * \
                        np.cos(2 * np.pi * roo) + n

                    if x_m < upper_bound:

                        return x_m

        else:
            if lower_bound == n:
                pass
            if (fm < fl and rooo <= threshold) or (fm >= fl):
                x_l = -lower_sigma_in_minutes * \
                    np.sqrt(2 * (-np.log(1 - ro))) * \
                    np.cos(2 * np.pi * roo) + n

                if x_l > lower_bound:
                    return x_l
