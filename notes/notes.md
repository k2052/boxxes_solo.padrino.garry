We need to give user permissions for a file Done through 2 ways. 1. Downloads models instances created with hashes that r emailed to user. 2. Files are purchases and added to users purchased items.

Payment needs to be flexible and work well with both workflows.

For ##2 user needs to create an actual account on server.    


The best workflow is for us to get the detail verify with tokens and then handle the file sending.      

Purchase page is intelligent form that detects data. Tell user to login if already has account.  Maybe should add existing data opion to padrino-fields Of course sometimes forms update so need hat supported. Intelleginte form appens item prucahse data which gets passed to model.


# Use cases.

Say we have a bundle like WP bundle. We need to have a user signup and send in payment details all in one shot. In the case of a bundle we should attach an initial purchase to the form.

User can purchase a file. So File extends Product. 

Files should be accessible via a hashed url. site/downlaods/:id Hash expires

User should be able to list files from account page. Remember just an example app so mutliple UX not a big deal.

After purchasing file user gets sent hash via email. We should wrap files in the ownership of the admin account just so we are thinking about how to approach the multiuser version.

So main page displays files for purchase. User purchase file gets sent to intellgient buy page. User buys product gets redirected to account page. Email is also sent. 

In a multisite context this is done using callbacks. User is sent to boxxes to pay for item. Item sucessfully paid for. 
Files can be listed at my.subdomain.com or my.customdomain.com; or maybe just sudbomain.com/myfiles. User is sent email.


# Spec

Create account instance
Purchase file
Generate file hash
download file via hash url.
