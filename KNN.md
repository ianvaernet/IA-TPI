# Algorithm kNN(D, d, k)

1. Compute the distance between d and every example in D;
2. Choose the k examples in D that are nearest to d, denote the set by P (⊆ D);
3. Assign d the class that is the most frequent class in P (or the majority class).

## Distance/similarity functions

- Minkowski distance
  - dist(xi,xj) = (|xi1-xj1|^h + |xi2-xj2|^h + ... + |xir-xjr|^h)^(1/h); // where h is a positive
  - Euclidian distance h = 2
  - Manhattan distance h = 1
- Cosine similarity

## Classifiers

### Bagging

1. Create k bootstrap samples S1, S2, and Sk. Each sample is produced by drawing n examples at random from D with replacement. Such a sample is called a bootstrap replicate of the original training set D. On average, each sample Si contains 63.2% of the original examples in D, with some examples appearing multiple times.
2. Build a classifier based on each sample Si. This gives us k classifiers. All the classifiers are built using the same base learning algorithm. 

### Boosting

AdaBoost(D, Y, BaseLeaner, k)
1.  Initialize D1(wi) ← 1/n for all i;                  // initialize the weights
2.  for t = 1 to k do                                   //
3.    ft ← BaseLearner(Dt);                             // build a new classifier ft
4.    et ← ∑ Dt(wi);                                    // compute the error of ft
          i:fi(Dt(xi))≠yi                               //
5.    if et > ½ then                                    // if the error is too large,
6.      k ← k – 1;                                      // remove the iteration and
7.      exit-loop;                                      // exit
8.    else                                              //
9.      βt ← et / (1− et);                              //
10.     Dt+1(wi) ← Dt(wi) × (ft(Dt(xi)) = y ? βt : 1);  // update the weights
11.     Dt+1(wi) ← (Dt+1(wi)) / (i=1∑n Dt+1(wi));       // normalize the weights
12.   endif                                             //
13. endfor                                              //
14. ffinal(x) ← argmax ∑ log (1/βt)                     // the final output classifier
                 y∈Y   t:ft(x)=y                        //
